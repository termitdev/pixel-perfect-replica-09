import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/LeadForm";

const TITLE = "Vamos conversar? — INA + Literare Books";
const DESC = "Preencha seus dados para receber nosso contato.";

// Replace with the institutional art (inacard.png) once uploaded.
const HERO_SRC: string | null = null;

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

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center px-3 py-3 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-[1200px] overflow-hidden rounded-[28px] bg-card md:grid-cols-[58fr_42fr] md:min-h-[min(700px,calc(100vh-5rem))]">
        <div className="relative h-[300px] overflow-hidden bg-panel sm:h-[400px] md:h-auto">
          {HERO_SRC && (
            <img
              src={HERO_SRC}
              alt="INA e Literare Books"
              className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
            />
          )}
        </div>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14" aria-labelledby="form-title">
          <div className="w-full max-w-sm fade-up">
            <h2 id="form-title" className="font-display text-3xl font-semibold tracking-tight text-navy">
              Vamos conversar?
            </h2>
            <p className="mb-8 mt-2 text-muted-foreground">{DESC}</p>
            <LeadForm />
          </div>
        </section>
      </div>
    </main>
  );
}
