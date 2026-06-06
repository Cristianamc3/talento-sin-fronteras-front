import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaSearch, FaBell, FaUser, FaComment, FaHeart, FaUsers,
  FaLayerGroup, FaHandshake, FaChalkboardTeacher, FaPalette,
  FaUserAstronaut, FaCode, FaExternalLinkAlt, FaRedo,
} from "react-icons/fa";
import { getProyectos } from "../services/api";
import "../styles/Dashboard.css";

// ─── Datos estáticos del sidebar ─────────────────────────────────────────────

const trendingItems = [
  { id: 1, title: "UI Animations Toolkit",       subtitle: "1.2k interacciones" },
  { id: 2, title: "Design System colaborativo",  subtitle: "987 reacciones" },
  { id: 3, title: "Música generativa + IA",      subtitle: "742 visitas" },
  { id: 4, title: "Ilustración botánica",         subtitle: "560 likes" },
];

const featuredProject = {
  title:         "Rebranding Identidad Visual",
  subtitle:      "Por @estudiocreativo · 45 colaboradores",
  imageGradient: "linear-gradient(135deg, #aac0db, #cbd6e4)",
};

const tabs = [
  { id: "feed",           labelKey: "dashboard.tabs.feed" },
  { id: "proyectos",      labelKey: "dashboard.tabs.projects" },
  { id: "colaboraciones", labelKey: "dashboard.tabs.collaborations" },
  { id: "mentoria",       labelKey: "dashboard.tabs.mentorship" },
];

const placeholderContent = {
  proyectos:      { icon: <FaLayerGroup />,        textKey: "dashboard.placeholder.projects.text" },
  colaboraciones: { icon: <FaHandshake />,          textKey: "dashboard.placeholder.collaborations.text" },
  mentoria:       { icon: <FaChalkboardTeacher />,  textKey: "dashboard.placeholder.mentorship.text" },
};

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Convierte una fecha ISO a texto relativo en español
 * @param {string} isoDate - Fecha en formato ISO 8601
 * @returns {string} Texto relativo (ej: "hace 3 horas")
 */
const timeAgoFromISO = (isoDate) => {
  if (!isoDate) return "";
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `hace ${days} día${days > 1 ? "s" : ""}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  if (mins > 0)  return `hace ${mins} minuto${mins > 1 ? "s" : ""}`;
  return "hace un momento";
};

/**
 * Adapta un proyecto de la API al formato del componente
 * @param {Object} p - Proyecto de la API
 * @returns {Object} Proyecto adaptado
 */
const adaptProject = (p) => ({
  id:            p._id,
  userName:      p.autor?.nombre  || "Anónimo",
  userInitial:   (p.autor?.nombre || "A")[0].toUpperCase(),
  userEmail:     p.autor?.email   || "",
  timeAgo:       timeAgoFromISO(p.createdAt),
  category:      p.tecnologias?.[0] || "General",
  tecnologias:   p.tecnologias    || [],
  cover:         `https://placehold.co/800x450/E9EDF2/5C7C6E?text=${encodeURIComponent(p.titulo || "Proyecto")}`,
  title:         p.titulo         || "Sin título",
  description:   p.descripcion    || "",
  enlace:        p.enlace         || null,
  estado:        p.estado         || "activo",
  comments:      0,
  likes:         0,
  collaborators: 0,
  liked:         false,
});

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Dashboard - Feed principal de la plataforma TalentoSinFronteras
 *
 * Carga proyectos reales desde GET /api/proyectos y los muestra en un feed.
 * Permite buscar, filtrar por tab, dar like y solicitar colaboración.
 *
 * @component
 * @returns {React.ReactElement}
 */
export default function Dashboard() {
  const [activeTab,    setActiveTab]    = useState("feed");
  const [projects,     setProjects]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [toast,        setToast]        = useState({ visible: false, message: "" });
  const [notifCount,   setNotifCount]   = useState(3);
  const [loadingMore,  setLoadingMore]  = useState(false);

  const toastTimer = useRef(null);
  const navigate   = useNavigate();
  const { t }      = useTranslation();

  // Limpia el timer del toast al desmontar
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: "" }), 2300);
  };

  // ─── Fetch proyectos desde la API ──────────────────────────────────────────

  /**
   * Carga los proyectos desde GET /api/proyectos
   * Adapta los campos de la API al formato del componente
   */
  const fetchProyectos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getProyectos();
      setProjects(data.map(adaptProject));
    } catch (err) {
      console.error("Error cargando proyectos:", err);
      setError(t("dashboard.errorLoading", "Error al cargar los proyectos"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  // ─── Búsqueda ──────────────────────────────────────────────────────────────

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const term = search.toLowerCase();
    return projects.filter((p) =>
      p.title.toLowerCase().includes(term)        ||
      p.description.toLowerCase().includes(term)  ||
      p.category.toLowerCase().includes(term)     ||
      p.userName.toLowerCase().includes(term)     ||
      p.tecnologias.some((t) => t.toLowerCase().includes(term))
    );
  }, [projects, search]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleLike = (projectId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      showToast(project.liked ? t("dashboard.likeRemoved", "Like removido") : t("dashboard.likeAdded", "¡Te gustó!"));
    }
  };

  const handleNotifClick = () => {
    showToast(t("dashboard.notifications", "No hay notificaciones nuevas"));
    setNotifCount(0);
  };

  const handleCreateProject = () => navigate("/project-form");

  // ─── Scroll infinito (simulado) ────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => {
      if (activeTab !== "feed" || loadingMore) return;
      const { scrollY } = window;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (scrollY + winHeight >= docHeight - 200) {
        setLoadingMore(true);
        setTimeout(() => setLoadingMore(false), 800);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeTab, loadingMore]);

  // ─── Renderizado del feed ──────────────────────────────────────────────────

  const renderFeed = () => {
    // Estado de carga
    if (loading) {
      return (
        <article className="project-card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "var(--text-tertiary)" }}>
            {t("dashboard.loadingProjects", "Cargando proyectos...")}
          </p>
        </article>
      );
    }

    // Estado de error
    if (error) {
      return (
        <article className="project-card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⚠️</div>
          <p style={{ color: "var(--error-main, #d32f2f)", marginBottom: "16px" }}>{error}</p>
          <button type="button" className="btn-primary" onClick={fetchProyectos}
            style={{ maxWidth: "200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaRedo /> {t("dashboard.retry", "Reintentar")}
          </button>
        </article>
      );
    }

    // Sin resultados de búsqueda
    if (filteredProjects.length === 0 && search.trim()) {
      return (
        <article className="project-card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🔍</div>
          <p style={{ color: "var(--text-tertiary)" }}>
            {t("dashboard.noResults", `Sin resultados para "${search}"`)}
          </p>
        </article>
      );
    }

    // Sin proyectos en la BD
    if (filteredProjects.length === 0) {
      return (
        <article className="project-card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📭</div>
          <p style={{ color: "var(--text-tertiary)" }}>
            {t("dashboard.noProjects", "Aún no hay proyectos. ¡Sé el primero!")}
          </p>
          <button type="button" className="btn-primary" onClick={handleCreateProject}
            style={{ marginTop: "24px", maxWidth: "240px", margin: "24px auto 0" }}>
            + {t("dashboard.createProject", "Crear proyecto")}
          </button>
        </article>
      );
    }

    // Lista de proyectos
    return filteredProjects.map((project) => (
      <article key={project.id} className="project-card">

        {/* Header del proyecto */}
        <div className="card-header">
          <div className="user-avatar">{project.userInitial}</div>
          <div className="user-info">
            <span className="user-name">{project.userName}</span>
            <div className="meta">
              <span>{project.timeAgo}</span>
              <span className="badge-category">{project.category}</span>
              {project.estado === "activo" && (
                <span style={{
                  fontSize: "0.7rem", background: "#e8f5e9", color: "#2e7d32",
                  padding: "2px 8px", borderRadius: "99px", fontWeight: 600
                }}>
                  Activo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Imagen placeholder */}
        <img className="project-media" src={project.cover} alt={project.title} />

        {/* Título y descripción */}
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        {/* Tecnologías */}
        {project.tecnologias.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {project.tecnologias.map((tech) => (
              <span key={tech} style={{
                fontSize: "0.72rem", background: "var(--surface-subtle, #f5f5f5)",
                color: "var(--text-secondary)", padding: "3px 10px",
                borderRadius: "99px", fontWeight: 500, display: "flex",
                alignItems: "center", gap: "4px"
              }}>
                <FaCode style={{ fontSize: "0.65rem" }} /> {tech}
              </span>
            ))}
          </div>
        )}

        {/* Enlace al repositorio */}
        {project.enlace && (
          <a href={project.enlace} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "0.78rem", color: "var(--primary-main, #5C7C6E)",
              marginBottom: "12px", textDecoration: "none", fontWeight: 500
            }}>
            <FaExternalLinkAlt /> Ver repositorio
          </a>
        )}

        {/* Estadísticas */}
        <div className="stats-row">
          <span><FaComment /> {project.comments} {t("dashboard.comments", "comentarios")}</span>
          <span className="like-stats">
            <FaHeart className={project.liked ? "like-active" : ""} /> {project.likes} likes
          </span>
          <span><FaUsers /> {project.collaborators} {t("dashboard.collaborators", "colaboradores")}</span>
        </div>

        {/* Acciones */}
        <div className="action-buttons">
          <button className="btn-primary" type="button" onClick={() => handleLike(project.id)}>
            <FaHeart /> {t("dashboard.likeButton", "Me gusta")}
          </button>
          <button className="btn-outline" type="button" onClick={() => showToast(t("dashboard.commentSoon", "Comentarios próximamente"))}>
            <FaComment /> {t("dashboard.commentButton", "Comentar")}
          </button>
          <button className="btn-link" type="button" onClick={() => showToast(t("dashboard.collabRequest", "Solicitud enviada"))}>
            {t("dashboard.requestCollaboration", "Colaborar")} →
          </button>
        </div>
      </article>
    ));
  };

  // ─── JSX principal ─────────────────────────────────────────────────────────

  const activePlaceholder = placeholderContent[activeTab];

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="header">
        <div className="container header-inner">
          <div className="logo">Talento<span>SinFronteras</span></div>
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder={t("dashboard.searchPlaceholder", "Buscar proyectos...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="icon-btn" type="button" onClick={handleNotifClick}>
              <FaBell />
              {notifCount > 0 && <span className="badge-notif">{notifCount}</span>}
            </button>
            <button className="avatar" type="button" onClick={() => navigate("/profile")}>
              <FaUser />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="container tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {t(tab.labelKey, tab.id)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="container main-grid">
        <section className="feed" id="feedContainer">

          {activeTab === "feed" ? (
            <>
              {renderFeed()}
              {loadingMore && (
                <div className="load-more-trigger">
                  {t("dashboard.loadingMore", "Cargando más...")}
                </div>
              )}
            </>
          ) : (
            <article className="project-card" style={{ textAlign: "center", padding: "48px" }}>
              <div className="card-header" style={{ justifyContent: "center" }}>
                <div className="user-avatar" style={{
                  backgroundColor: "var(--surface-subtle)",
                  color: "var(--text-tertiary)"
                }}>
                  {activePlaceholder?.icon}
                </div>
              </div>
              <p style={{ color: "var(--text-tertiary)", marginTop: "12px" }}>
                {t(activePlaceholder?.textKey, "Próximamente")}
              </p>
              {activeTab === "proyectos" && (
                <button type="button" className="btn-primary" onClick={handleCreateProject}
                  style={{ marginTop: "24px", maxWidth: "280px", margin: "24px auto 0" }}>
                  + {t("dashboard.createProject", "Crear proyecto")}
                </button>
              )}
            </article>
          )}
        </section>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="widget">
            <div className="widget-title">{t("dashboard.trendingTitle", "Tendencias")}</div>
            {trendingItems.map((item) => (
              <div key={item.id} className="trending-item">
                <div className="trending-rank">{item.id}</div>
                <div className="trending-info">
                  <p>{item.title}</p>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="widget">
            <div className="widget-title">{t("dashboard.featuredTitle", "Destacado")}</div>
            <div className="featured-card">
              <div className="featured-img" style={{ backgroundImage: featuredProject.imageGradient }} />
              <h4 style={{ margin: "8px 0 4px" }}>{featuredProject.title}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{featuredProject.subtitle}</p>
              <button className="btn-outline" type="button" style={{ marginTop: "10px", width: "100%" }}>
                {t("dashboard.viewProject", "Ver proyecto")}
              </button>
            </div>
          </div>

          <div className="widget">
            <div className="widget-title">{t("dashboard.collaborationsTitle", "Colaboraciones abiertas")}</div>
            <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div><FaLayerGroup /> Desarrollador React · Proyecto open source</div>
              <div><FaPalette /> Diseñador UX/UI · App de mentorías</div>
              <div><FaUserAstronaut /> Compositor musical · Cortometraje</div>
            </div>
            <button className="btn-link" type="button" style={{ marginTop: "12px" }}>
              {t("dashboard.viewAll", "Ver todas")} →
            </button>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">{t("dashboard.footer", "© 2026 TalentoSinFronteras")}</div>
      </footer>

      {/* Toast */}
      {toast.visible && <div className="custom-toast">{toast.message}</div>}
    </div>
  );
}