import { Navigate, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./state/AuthContext.jsx";

function Protected({ children, admin = false }) {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const gaId = import.meta.env.VITE_GA_ID;

  return (
    <>
      <Helmet>
        <title>Ritik Singh Portfolio</title>
        <meta name="description" content="Data Analyst, Power BI Developer, SQL Developer, and AI Enthusiast portfolio." />
        {gaId && <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />}
        {gaId && (
          <script>{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}</script>
        )}
      </Helmet>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/projects/:slug" element={<Protected><ProjectDetails /></Protected>} />
        <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
