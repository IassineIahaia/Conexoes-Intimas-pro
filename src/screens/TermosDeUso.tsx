import { useNavigate } from "react-router-dom";

export default function TermosDeUso() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20 h-16 flex items-center px-gutter-mobile">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label-caps text-label-caps uppercase tracking-widest">Voltar</span>
        </button>
      </header>

      <main className="pt-28 pb-20 px-gutter-mobile max-w-2xl mx-auto">
        <h1 className="font-headline-md text-headline-md text-primary mb-2">Termos de Uso</h1>
        <p className="text-on-surface-variant/60 text-sm mb-10">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="space-y-8 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <section className="p-5 rounded-xl border border-error/30 bg-error-container/10">
            <p className="text-on-surface font-medium">
              Este serviço é destinado exclusivamente a pessoas com 18 anos ou mais. Ao usar o
              Conexões Íntimas, confirmas que tens a idade legal exigida na tua jurisdição para
              aceder a este tipo de conteúdo.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              1. Aceitação dos termos
            </h2>
            <p>
              Ao aceder e usar o Conexões Íntimas, concordas com estes Termos de Uso e com a nossa
              Política de Privacidade. Se não concordares, não deves usar o serviço.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              2. Uso adequado
            </h2>
            <p className="mb-3">Ao usar este serviço, comprometes-te a:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Usar o jogo apenas com participantes que também consintam livremente</li>
              <li>Não usar o serviço para assediar, coagir ou prejudicar outra pessoa</li>
              <li>Não tentar contornar as proteções de segurança ou autenticação do site</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              3. Natureza do conteúdo
            </h2>
            <p>
              O conteúdo do jogo inclui perguntas e desafios de natureza íntima, dirigidos a
              adultos consentidos. O conteúdo é apresentado em texto; a decisão de como responder
              ou executar cada desafio é sempre voluntária e da responsabilidade dos jogadores.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              4. Propriedade intelectual
            </h2>
            <p>
              O design, marca, textos e código do Conexões Íntimas são propriedade dos seus
              criadores. Não é permitida a reprodução ou redistribuição sem autorização.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              5. Isenção de responsabilidade
            </h2>
            <p>
              O serviço é fornecido "tal como está". Não nos responsabilizamos por consequências
              decorrentes do uso do jogo entre os participantes; a responsabilidade pelas
              interações é sempre dos próprios utilizadores.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              6. Publicidade
            </h2>
            <p>
              Este serviço pode ser parcialmente financiado por publicidade de terceiros,
              apresentada de forma clara e identificada como tal, conforme descrito na Política de
              Privacidade.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              7. Alterações e contacto
            </h2>
            <p>
              Podemos atualizar estes termos a qualquer momento. Para questões, contacta-nos
              através do e-mail de suporte disponibilizado na aplicação.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}