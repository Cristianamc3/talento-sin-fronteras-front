import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaComment,
  FaHeart,
  FaUsers,
  FaLayerGroup,
  FaHandshake,
  FaChalkboardTeacher,
  FaPalette,
  FaUserAstronaut,
} from "react-icons/fa";
import "../styles/Dashboard.css";

/**
 * Datos iniciales de proyectos en el feed
 * 
 * @type {Array<Object>} Array de proyectos con información de autor,
 * descripción, estadísticas y visualización
 */
const initialProjects = [
  {
    id: 1,
    userName: "Mariana López",
    userInitial: "ML",
    timeAgo: "hace 3 horas",
    category: "Diseño UI/UX",
    cover: "https://placehold.co/800x450/E9EDF2/5C7C6E?text=UI+Exploration",
    title: "Sistema de diseño accesible para editoriales",
    description:
      "Exploración de paletas de bajo contraste y tipografías modulares para mejorar la lectura en plataformas educativas.",
    comments: 24,
    likes: 87,
    collaborators: 6,
    liked: false,
  },
  {
    id: 2,
    userName: "Carlos Méndez",
    userInitial: "CM",
    timeAgo: "hace 1 día",
    category: "Desarrollo Web",
    cover: "https://placehold.co/800x450/ECF3EF/5C7C6E?text=Portfolio+Maker",
    title: "Portafolio 3D interactivo con Three.js",
    description:
      "Un portafolio personal que incluye modelos 3D y animaciones fluidas. Código abierto para contribuciones.",
    comments: 14,
    likes: 134,
    collaborators: 3,
    liked: false,
  },
  {
    id: 3,
    userName: "Lucía Rivera",
    userInitial: "LR",
    timeAgo: "hace 6 horas",
    category: "Ilustración",
    cover: "https://placehold.co/800x450/F6EEEB/B16E5C?text=Bestiario+Digital",
    title: "Bestiario fantástico - ilustración digital",
    description:
      "Serie de ilustraciones de criaturas mitológicas con técnicas mixtas. Abierto a colaboraciones para animación.",
    comments: 42,
    likes: 210,
    collaborators: 2,
    liked: true,
  },
  {
    id: 4,
    userName: "Julián Software",
    userInitial: "JS",
    timeAgo: "hace 2 días",
    category: "Código Abierto",
    cover: "https://placehold.co/800x450/E9EDF2/5C7C6E?text=Git+Toolkit",
    title: "CLI para gestión de comunidades creativas",
    description:
      "Herramienta en Node.js que automatiza creación de redes de mentores. ¡Buscamos testers!",
    comments: 8,
    likes: 44,
    collaborators: 5,
    liked: false,
  },
];

const trendingItems = [
  { id: 1, title: "UI Animations Toolkit", subtitle: "1.2k interacciones" },
  { id: 2, title: "Design System colaborativo", subtitle: "987 reacciones" },
  { id: 3, title: "Música generativa + IA", subtitle: "742 visitas" },
  { id: 4, title: "Ilustración botánica", subtitle: "560 likes" },
];

const featuredProject = {
  title: "Rebranding Identidad Visual",
  subtitle: "Por @estudiocreativo · 45 colaboradores",
  imageGradient: "linear-gradient(135deg, #aac0db, #cbd6e4)",
};

const tabs = [
  { id: "feed", labelKey: "dashboard.tabs.feed" },
  { id: "proyectos", labelKey: "dashboard.tabs.projects" },
  { id: "colaboraciones", labelKey: "dashboard.tabs.collaborations" },
  { id: "mentoria", labelKey: "dashboard.tabs.mentorship" },
];

const placeholderContent = {
  proyectos: {
    icon: <FaLayerGroup />,
    textKey: "dashboard.placeholder.projects.text",
  },
  colaboraciones: {
    icon: <FaHandshake />,
    textKey: "dashboard.placeholder.collaborations.text",
  },
  mentoria: {
    icon: <FaChalkboardTeacher />,
    textKey: "dashboard.placeholder.mentorship.text",
  },
};

/**
 * Componente Dashboard - Feed principal de la plataforma
 * 
 * Muestra un feed de proyectos con múltiples tabs (Feed, Proyectos, Colaboraciones, Mentoría).
 * Permite buscar, filtrar, dar like y solicitar colaboración en proyectos.
 * Incluye widgets laterales con tendencias, proyecto destacado y colaboraciones abiertas.
 * 
 * @component
 * @returns {React.ReactElement} Página del dashboard con feed completo
 * 
 * @example
 * <Dashboard />
 * 
 * @todo Implementar carga infinita real desde API
 * @todo Integrar búsqueda en tiempo real
 * @todo Agregar filtros avanzados por habilidades
 */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("feed");
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [notifCount, setNotifCount] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);
  const toastTimer = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const showToast = (message) => {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    setToast({ visible: true, message });
    toastTimer.current = window.setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 2300);
  };

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const term = search.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.category.toLowerCase().includes(term) ||
        project.userName.toLowerCase().includes(term)
    );
  }, [projects, search]);

  const handleLike = (projectId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              liked: !project.liked,
              likes: project.liked ? project.likes - 1 : project.likes + 1,
            }
          : project
      )
    );
    const project = projects.find((item) => item.id === projectId);
    if (project) {
      showToast(project.liked ? t("dashboard.likeRemoved") : t("dashboard.likeAdded"));
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleNotifClick = () => {
    showToast(t("dashboard.notifications"));
    setNotifCount(0);
  };

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const onScroll = () => {
      if (activeTab !== "feed" || loadingMore) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (scrollTop + winHeight >= docHeight - 200) {
        setLoadingMore(true);
        setTimeout(() => {
          setProjects((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              userName: "Nuevo Talento",
              userInitial: "NT",
              timeAgo: "hace 5 minutos",
              category: "Maker",
              cover: "https://placehold.co/800x450/E9EDF2/5C7C6E?text=Electrónica+Creativa",
              title: "Prototipo de instrumento interactivo",
              description:
                "Proyecto open hardware y software. Buscamos colaboradores para expandir funcionalidades.",
              comments: 3,
              likes: 18,
              collaborators: 2,
              liked: false,
            },
          ]);
          setLoadingMore(false);
          showToast(t("dashboard.newProjectLoaded"));
        }, 800);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeTab, loadingMore, t]);

  const activePlaceholder = placeholderContent[activeTab];

  return (
    <div className="dashboard-page">
      <div className="header">
        <div className="container header-inner">
          <div className="logo">
            Talento<span>SinFronteras</span>
          </div>
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder={t("dashboard.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="icon-btn" type="button" onClick={handleNotifClick}>
              <FaBell />
              {notifCount > 0 && <span className="badge-notif">{notifCount}</span>}
            </button>
            <button className="avatar" type="button" onClick={handleAvatarClick}>
              <FaUser />
            </button>
          </div>
        </div>
        <div className="tabs-container">
          <div className="container tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container main-grid">
        <section className="feed" id="feedContainer">
          {activeTab === "feed" ? (
            filteredProjects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="card-header">
                  <div className="user-avatar">{project.userInitial}</div>
                  <div className="user-info">
                    <div className="user-name">{project.userName}</div>
                    <div className="meta">
                      <span>{project.timeAgo}</span>
                      <span className="badge-category">{project.category}</span>
                    </div>
                  </div>
                </div>
                <img className="project-media" src={project.cover} alt={project.title} />
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="stats-row">
                  <span>
                    <FaComment /> {project.comments} {t("dashboard.comments")}
                  </span>
                  <span className="like-stats">
                    <FaHeart className={project.liked ? "like-active" : ""} /> {project.likes} likes
                  </span>
                  <span>
                    <FaUsers /> {project.collaborators} {t("dashboard.collaborators")}
                  </span>
                </div>
                <div className="action-buttons">
                  <button className="btn-primary" type="button" onClick={() => handleLike(project.id)}>
                    <FaHeart /> {t("dashboard.likeButton")}
                  </button>
                  <button className="btn-outline" type="button" onClick={() => showToast(t("dashboard.commentSoon"))}>
                    <FaComment /> {t("dashboard.commentButton")}
                  </button>
                  <button className="btn-link" type="button" onClick={() => showToast(t("dashboard.collabRequest"))}>
                    {t("dashboard.requestCollaboration")} →
                  </button>
                </div>
              </article>
            ))
          ) : (
            <article className="project-card" style={{ textAlign: "center", padding: "48px" }}>
              <div className="card-header" style={{ justifyContent: "center" }}>
                <div className="user-avatar" style={{ backgroundColor: "var(--surface-subtle)", color: "var(--text-tertiary)" }}>
                  {activePlaceholder?.icon}
                </div>
              </div>
              <p style={{ color: "var(--text-tertiary)", marginTop: "12px" }}>{t(activePlaceholder?.textKey)}</p>
            </article>
          )}
          {loadingMore && <div className="load-more-trigger">{t("dashboard.loadingMore")}</div>}
        </section>

        <aside className="sidebar">
          <div className="widget">
            <div className="widget-title">{t("dashboard.trendingTitle")}</div>
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
            <div className="widget-title">{t("dashboard.featuredTitle")}</div>
            <div className="featured-card">
              <div className="featured-img" style={{ backgroundImage: featuredProject.imageGradient }} />
              <h4 style={{ margin: "8px 0 4px" }}>{featuredProject.title}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{featuredProject.subtitle}</p>
              <button className="btn-outline" type="button" style={{ marginTop: "10px", width: "100%" }}>
                {t("dashboard.viewProject")}
              </button>
            </div>
          </div>

          <div className="widget">
            <div className="widget-title">{t("dashboard.collaborationsTitle")}</div>
            <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div><FaLayerGroup /> Desarrollador React · Proyecto open source</div>
              <div><FaPalette /> Diseñador UX/UI · App de mentorías</div>
              <div><FaUserAstronaut /> Compositor musical · Cortometraje</div>
            </div>
            <button className="btn-link" type="button" style={{ marginTop: "12px" }}>
              {t("dashboard.viewAll")} →
            </button>
          </div>
        </aside>
      </main>

      <footer>
        <div className="container">{t("dashboard.footer")}</div>
      </footer>

      {toast.visible && <div className="custom-toast">{toast.message}</div>}
    </div>
  );
}
