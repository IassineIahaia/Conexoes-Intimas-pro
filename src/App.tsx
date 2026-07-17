import { Routes, Route } from "react-router-dom";
import PaginaInicial from "./screens/PaginaInicial";
import VerificacaoIdade from "./screens/VerificacaoIdade";
import ConfiguracaoJogo from "./screens/ConfiguracaoJogo";
import TelaDeJogo from "./screens/TelaDeJogo";
import Resultados from "./screens/Resultados";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./lib/ProtectedRoute";
import Dashboard from "./admin/Dashboard";
import QuestionsList from "./admin/QuestionsList";
import QuestionForm from "./admin/QuestionForm";
import BulkImport from "./admin/BulkImport";


function App() {
  return (
    <Routes>
      <Route path="/" element={<VerificacaoIdade />} />
      <Route path="/inicio" element={<PaginaInicial />} />
      <Route path="/setup" element={<ConfiguracaoJogo />} />
      <Route path="/jogo" element={<TelaDeJogo />} />
      <Route path="/resultados" element={<Resultados />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/perguntas"
        element={
          <ProtectedRoute>
            <QuestionsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/perguntas/nova"
        element={
          <ProtectedRoute>
            <QuestionForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/perguntas/:id/editar"
        element={
          <ProtectedRoute>
            <QuestionForm />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/importar"
  element={
    <ProtectedRoute>
      <BulkImport />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;
