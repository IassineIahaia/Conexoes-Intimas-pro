import { useNavigate } from "react-router-dom";

export default function PoliticaPrivacidade() {
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
        <h1 className="font-headline-md text-headline-md text-primary mb-2">
          Política de Privacidade
        </h1>
        <p className="text-on-surface-variant/60 text-sm mb-10">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="space-y-8 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              1. Quem somos
            </h2>
            <p>
              O Conexões Íntimas é um jogo digital de verdade ou desafio para casais e adultos,
              com verificação de idade obrigatória (18+). Esta política explica que dados
              recolhemos, porquê, e como os protegemos.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              2. Dados que recolhemos
            </h2>
            <p className="mb-3">Recolhemos apenas o necessário para o funcionamento do serviço:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nomes de jogadores inseridos na configuração de cada sessão (não associados a conta, salvo se te autenticares como administrador)</li>
              <li>Dados técnicos de utilização (páginas visitadas, tipo de dispositivo) para melhorar o produto</li>
              <li>Cookies de publicidade, apenas com o teu consentimento explícito</li>
              <li>Para contas de administrador: e-mail e credenciais de acesso, geridos pelo Firebase Authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              3. Base legal e finalidade (LGPD)
            </h2>
            <p>
              Tratamos os teus dados com base no teu consentimento (cookies e publicidade) e no
              nosso interesse legítimo em manter e melhorar o serviço. Não vendemos os teus dados
              a terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              4. Cookies e publicidade
            </h2>
            <p>
              Podemos exibir anúncios através de redes como o Google AdSense, que podem usar
              cookies para personalizar anúncios. Podes recusar estes cookies a qualquer momento
              através do banner de consentimento ou das definições do teu navegador — a
              funcionalidade principal do jogo continua disponível mesmo assim.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              5. Os teus direitos
            </h2>
            <p>
              Nos termos da LGPD (Lei Geral de Proteção de Dados), tens direito a aceder, corrigir,
              eliminar ou solicitar a portabilidade dos teus dados pessoais. Para exercer estes
              direitos, contacta-nos através do e-mail de suporte indicado nos Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              6. Segurança
            </h2>
            <p>
              Os dados são armazenados no Firebase (Google Cloud), com regras de acesso restritas:
              apenas administradores autenticados podem gerir o conteúdo do jogo.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">
              7. Alterações a esta política
            </h2>
            <p>
              Podemos atualizar esta política ocasionalmente. Notificaremos alterações
              significativas através da própria aplicação.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}