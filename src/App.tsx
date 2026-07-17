import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./lib/ProtectedRoute";

// Telas do jogador: carregadas normalmente, são o caminho mais usado
import VerificacaoIdade from "./screens/VerificacaoIdade";
import PaginaInicial from "./screens/PaginaInicial";
import ConfiguracaoJogo from "./screens/ConfiguracaoJogo";
import TelaDeJogo from "./screens/TelaDeJogo";
import Resultados from "./screens/Resultados";
import ComingSoon from "./screens/ComingSoon";
import PoliticaPrivacidade from "./screens/PoliticaPrivacidade";
import TermosDeUso from "./screens/TermosDeUso";

// Painel administrativo: só carrega o código (Firestore, PapaParse, etc.)
// quando alguém realmente visita uma rota /admin — reduz o bundle inicial
// para quem só quer jogar.
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const QuestionsList = lazy(() => import("./admin/QuestionsList"));
const QuestionForm = lazy(() => import("./admin/QuestionForm"));
const BulkImport = lazy(() => import("./admin/BulkImport"));

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
      A carregar painel administrativo...
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<VerificacaoIdade />} />
      <Route path="/inicio" element={<PaginaInicial />} />
      <Route path="/setup" element={<ConfiguracaoJogo />} />
      <Route path="/jogo" element={<TelaDeJogo />} />
      <Route path="/resultados" element={<Resultados />} />

      <Route
        path="/explorar"
        element={
          <ComingSoon
            title="Explorar"
            icon="explore"
            description="Uma biblioteca navegável de perguntas e desafios está a caminho."
          />
        }
      />
      <Route
        path="/favoritos"
        element={
          <ComingSoon
            title="Favoritos"
            icon="favorite"
            description="Em breve poderás guardar as cartas que mais gostaste para reviver depois."
          />
        }
      />
      <Route
        path="/configuracoes"
        element={
          <ComingSoon
            title="Configurações"
            icon="settings"
            description="Preferências de conta, som e privacidade chegam em breve."
          />
        }
      />

      <Route path="/privacidade" element={<PoliticaPrivacidade />} />
      <Route path="/termos" element={<TermosDeUso />} />

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/perguntas"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <QuestionsList />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/perguntas/nova"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <QuestionForm />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/perguntas/:id/editar"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <QuestionForm />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/importar"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <BulkImport />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;