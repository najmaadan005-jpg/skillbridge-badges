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
    SELECT id INTO _badge FROM public.badges WHERE user_id = auth.uid() AND skill = _skill
      ORDER BY score_percent DESC, created_at DESC LIMIT 1;
    IF _badge IS NULL THEN
      INSERT INTO public.badges (user_id, skill, score_percent, full_name, country, profession, years_experience)
      VALUES (auth.uid(), _skill, _pct, COALESCE(_p.full_name,''), COALESCE(_p.country,''), COALESCE(_p.profession,''), COALESCE(_p.years_experience,0))
      RETURNING id INTO _badge;
    ELSE
      UPDATE public.badges SET
        score_percent = GREATEST(score_percent, _pct),
        created_at = CASE WHEN _pct > score_percent THEN now() ELSE created_at END,
        full_name = COALESCE(_p.full_name,''), country = COALESCE(_p.country,''),
        profession = COALESCE(_p.profession,''), years_experience = COALESCE(_p.years_experience,0)
      WHERE id = _badge;
      UPDATE public.test_attempts SET badge_id = _badge WHERE user_id = auth.uid() AND skill = _skill AND badge_id IS NOT NULL AND badge_id <> _badge;
      DELETE FROM public.badges WHERE user_id = auth.uid() AND skill = _skill AND id <> _badge;
    END IF;
  END IF;
  INSERT INTO public.test_attempts (user_id, skill, score, total, badge_id)
  VALUES (auth.uid(), _skill, _score, 10, _badge) RETURNING id INTO _attempt;
  RETURN _attempt;
END $$;
REVOKE EXECUTE ON FUNCTION public.submit_skill_test(text, int[]) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.submit_skill_test(text, int[]) TO authenticated;