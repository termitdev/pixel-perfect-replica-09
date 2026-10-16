export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export type LeadInput = { nome: string; email: string; telefone: string };
export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {};
  const nome = v.nome.trim();
  if (!nome) e.nome = "Informe seu nome completo.";
  else if (nome.length < 3 || nome.length > 120) e.nome = "O nome deve ter entre 3 e 120 caracteres.";
  const email = v.email.trim();
  if (!email) e.email = "Informe seu e-mail.";
  else if (!EMAIL_RE.test(email) || email.length > 254) e.email = "Informe um e-mail válido.";
  const digits = v.telefone.replace(/\D/g, "");
  if (!digits) e.telefone = "Informe seu telefone.";
  else if (digits.length < 10 || digits.length > 11) e.telefone = "Informe um telefone válido com DDD.";
  return e;
}
