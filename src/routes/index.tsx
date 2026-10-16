
import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/LeadForm";
import Velaris from "@/components/ui/velaris";

const TITLE = "Vamos conversar? — INA + Literare Books";
const DESC = "Preencha seus dados para receber nosso contato.";
const HERO_SRC = "/herobanner.png";

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
    <main className="relative isolate min-h-screen bg-[#050D16]">
      {/* Fundo animado Velaris */}
      <Velaris
        bg="#050D16"
        colors={[
          "#0B182C",
          "#163B59",
          "#256D85",
          "#02060D",
        ]}
        speed={1.2}
        grain={0.15}
        height="100vh"
        className="pointer-events-none fixed inset-0 z-[-1]"
      >
        <div />
      </Velaris>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-3 py-4 sm:px-6 sm:py-10">
        <div className="grid w-full max-w-[800px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0B182C]/90 shadow-2xl shadow-black/20 backdrop-blur-xl md:min-h-[min(700px,calc(100vh-5rem))] md:grid-cols-[58fr_42fr]">
          {/* Imagem institucional */}
          <div className="relative h-[500px] overflow-hidden bg-[#0B182C] sm:h-[400px] md:h-auto">
            <img
              src={HERO_SRC}
              alt="INA e Literare Books"
              className="absolute inset-0 h-full w-full object-cover object-[center_50%]"
            />
          </div>

          {/* Formulário */}
          <section
            className="flex items-center justify-center bg-transparent px-6 py-9 sm:px-10 sm:py-10 lg:px-12"
            aria-label="Formulário de contato"
          >
            <div className="fade-up w-full max-w-sm">
              <LeadForm
                header={
                  <>
                    <h2
                      id="form-title"
                      className="font-display text-3xl font-semibold tracking-tight text-white"
                    >
                      Vamos conversar?
                    </h2>

                    <p className="mb-8 mt-2 text-sm leading-relaxed text-white/70">
                      {DESC}
                    </p>
                  </>
                }
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
