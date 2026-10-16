import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { maskPhone, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";

type Status = "idle" | "loading" | "success" | "error";

const fields: { name: keyof LeadInput; label: string; type: string; placeholder: string; autoComplete: string; inputMode?: "email" | "tel" }[] = [
  { name: "nome", label: "Nome completo", type: "text", placeholder: "Digite seu nome completo", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", placeholder: "seu@email.com", autoComplete: "email", inputMode: "email" },
  { name: "telefone", label: "Telefone", type: "tel", placeholder: "(11) 99999-9999", autoComplete: "tel-national", inputMode: "tel" },
];

export function LeadForm() {
  const [values, setValues] = useState<LeadInput>({ nome: "", email: "", telefone: "" });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (name: keyof LeadInput, raw: string) => {
    const v = name === "telefone" ? maskPhone(raw) : raw;
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const errs = validateLead(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`lead-${first}`)?.focus();
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const { error } = await supabase.from("leads").insert({
        nome: values.nome.trim(),
        email: values.email.trim().toLowerCase(),
        telefone: values.telefone,
      });
      if (error) throw error;
      setStatus("success");
    } catch (err) {
      const offline = typeof navigator !== "undefined" && !navigator.onLine;
      setErrorMsg(
        offline
          ? "Sem conexão com a internet. Verifique sua rede e tente novamente."
          : "Não foi possível enviar seus dados agora. Tente novamente em instantes.",
      );
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="fade-up text-center">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-bronze-gradient shadow-bronze">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-navy" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-semibold text-navy">Tudo certo!</h2>
        <p className="mt-2 text-muted-foreground">Dados enviados com sucesso! Em breve entraremos em contato.</p>
      </div>
    );
  }

  const loading = status === "loading";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={loading}>
      {fields.map((f) => {
        const err = errors[f.name];
        return (
          <div key={f.name}>
            <label htmlFor={`lead-${f.name}`} className="mb-2 block text-sm font-semibold text-navy">
              {f.label}
            </label>
            <input
              id={`lead-${f.name}`}
              name={f.name}
              type={f.type}
              inputMode={f.inputMode}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              required
              value={values[f.name]}
              onChange={(e) => update(f.name, e.target.value)}
              aria-invalid={!!err}
              aria-describedby={err ? `lead-${f.name}-err` : undefined}
              disabled={loading}
              className={`h-13 w-full rounded-xl border bg-field px-4 text-base text-navy placeholder:text-muted-foreground/70 outline-none transition focus:border-bronze focus:bg-card focus:ring-4 focus:ring-bronze/20 disabled:opacity-60 ${
                err ? "border-destructive" : "border-transparent"
              }`}
            />
            {err && (
              <p id={`lead-${f.name}-err`} className="mt-1.5 text-sm text-destructive">
                {err}
              </p>
            )}
          </div>
        );
      })}

      {status === "error" && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-bronze-gradient font-semibold text-navy shadow-bronze transition duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bronze/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-75"
      >
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" aria-hidden />}
        {loading ? "Enviando..." : "Quero receber contato"}
      </button>
    </form>
  );
}
