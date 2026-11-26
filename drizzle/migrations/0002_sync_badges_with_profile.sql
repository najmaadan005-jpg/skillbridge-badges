CREATE OR REPLACE FUNCTION public.sync_badges_from_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.badges SET full_name = NEW.full_name, country = NEW.country,
    profession = NEW.profession, years_experience = NEW.years_experience
  WHERE user_id = NEW.id;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.sync_badges_from_profile() FROM anon, authenticated, public;
DROP TRIGGER IF EXISTS profiles_sync_badges ON public.profiles;
CREATE TRIGGER profiles_sync_badges AFTER INSERT OR UPDATE OF full_name, country, profession, years_experience ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_badges_from_profile();
UPDATE public.badges b SET full_name = p.full_name, country = p.country,
  profession = p.profession, years_experience = p.years_experience
FROM public.profiles p WHERE p.id = b.user_id;