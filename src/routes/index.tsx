import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/LeadForm";

const TITLE = "Dê o próximo passo — Fale com a gente";
const DESC = "Preencha seus dados para receber mais informações e descobrir como podemos ajudar você.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: Index,
});

const steps = [
  { n: "01", t: "Informe seus dados" },
  { n: "02", t: "Receba nosso contato" },
  { n: "03", t: "Descubra as possibilidades" },
];

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center px-3 py-3 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-[1200px] gap-3 overflow-hidden rounded-[28px] bg-card p-2 sm:p-3 lg:min-h-[680px] lg:grid-cols-[58fr_42fr]">
        <section className="relative flex flex-col justify-between overflow-hidden rounded-[22px] bg-panel p-7 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 panel-glow" aria-hidden />
          <div className="relative fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-bronze/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-bronze">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze" aria-hidden />
              VAMOS COMEÇAR
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Dê o próximo <span className="text-bronze">passo.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-primary-foreground/70 sm:text-lg">{DESC}</p>
          </div>

          <ol className="relative mt-10 grid gap-3 sm:grid-cols-3 lg:mt-0">
            {steps.map((s) => (
              <li key={s.n} className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-4 backdrop-blur-sm sm:p-5">
                <span className="font-display text-sm font-semibold text-bronze">{s.n}</span>
                <p className="mt-2 text-sm font-medium leading-snug text-primary-foreground/90">{s.t}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex items-center justify-center rounded-[22px] px-5 py-10 sm:px-10 lg:px-12" aria-labelledby="form-title">
          <div className="w-full max-w-sm fade-up">
            <h2 id="form-title" className="font-display text-3xl font-semibold tracking-tight text-navy">
              Vamos conversar?
            </h2>
            <p className="mb-8 mt-2 text-muted-foreground">Preencha o formulário e entraremos em contato.</p>
            <LeadForm />
          </div>
        </section>
      </div>
    </main>
  );
}
