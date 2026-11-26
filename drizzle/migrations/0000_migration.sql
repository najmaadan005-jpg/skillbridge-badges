CREATE TYPE public.app_role AS ENUM ('candidate', 'employer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  profession text NOT NULL DEFAULT '',
  years_experience int NOT NULL DEFAULT 0,
  company text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (
    NEW.id,
    CASE WHEN NEW.raw_user_meta_data->>'account_type' = 'employer' THEN 'employer'::app_role ELSE 'candidate'::app_role END
  );
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL,
  score int NOT NULL,
  total int NOT NULL,
  badge_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.test_attempts TO authenticated;
GRANT ALL ON public.test_attempts TO service_role;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts read" ON public.test_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Badges are public verification records (shareable link + employer browsing)
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL,
  score_percent int NOT NULL,
  full_name text NOT NULL,
  country text NOT NULL,
  profession text NOT NULL,
  years_experience int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.badges TO anon, authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges are public" ON public.badges FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  badge_id uuid NOT NULL,
  employer_name text NOT NULL,
  reply_email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "employers send" ON public.contact_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = employer_id AND public.has_role(auth.uid(), 'employer'));
CREATE POLICY "participants read" ON public.contact_requests FOR SELECT TO authenticated
  USING (auth.uid() = candidate_id OR auth.uid() = employer_id);

-- Server-side scoring: answer keys never reach the browser
CREATE OR REPLACE FUNCTION public.submit_skill_test(_skill text, _answers int[])
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _key int[];
  _score int := 0;
  _pct int;
  _attempt uuid;
  _badge uuid;
  _p public.profiles;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  _key := CASE _skill
    WHEN 'web-development' THEN ARRAY[1,3,3,3,2,3,2,1,0,0]
    WHEN 'bookkeeping' THEN ARRAY[2,1,2,2,0,1,2,3,3,1]
    WHEN 'nursing-basics' THEN ARRAY[2,0,3,3,1,1,1,0,1,0]
    WHEN 'customer-service' THEN ARRAY[1,1,1,2,0,0,2,1,1,3]
  END;
  IF _key IS NULL THEN RAISE EXCEPTION 'Unknown skill'; END IF;
  IF COALESCE(array_length(_answers, 1), 0) <> 10 THEN RAISE EXCEPTION 'Answer all 10 questions'; END IF;
  FOR i IN 1..10 LOOP
    IF _answers[i] = _key[i] THEN _score := _score + 1; END IF;
  END LOOP;
  _pct := _score * 10;
  IF _pct >= 70 THEN
    SELECT * INTO _p FROM public.profiles WHERE id = auth.uid();
    INSERT INTO public.badges (user_id, skill, score_percent, full_name, country, profession, years_experience)
    VALUES (auth.uid(), _skill, _pct, COALESCE(_p.full_name,''), COALESCE(_p.country,''), COALESCE(_p.profession,''), COALESCE(_p.years_experience,0))
    RETURNING id INTO _badge;
  END IF;
  INSERT INTO public.test_attempts (user_id, skill, score, total, badge_id)
  VALUES (auth.uid(), _skill, _score, 10, _badge) RETURNING id INTO _attempt;
  RETURN _attempt;
END $$;
REVOKE EXECUTE ON FUNCTION public.submit_skill_test(text, int[]) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.submit_skill_test(text, int[]) TO authenticated;