CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL CHECK (char_length(btrim(nome)) BETWEEN 3 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefone TEXT NOT NULL CHECK (char_length(regexp_replace(telefone, '\D', '', 'g')) BETWEEN 10 AND 11),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT (nome, email, telefone) ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);