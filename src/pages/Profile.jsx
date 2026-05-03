import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaPen,
  FaSignOutAlt,
  FaHome,
  FaUserAstronaut,
  FaCode,
  FaLayerGroup,
  FaComment,
  FaHeart,
  FaTimesCircle,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import "../styles/Profile.css";

/**
 * Datos iniciales del perfil de usuario
 * 
 * @type {Object} Objeto con información del perfil del usuario actual
 */
const initialProfileData = {
  name: "Mariana López",
  role: "✨ Creadora · Diseñadora UI/UX",
  bio: "Apasionada por el diseño accesible y las interfaces inclusivas. Actualmente explorando animación con CSS y herramientas de prototipado.",
  avatar: null,
  skills: ["UX Research", "Figma", "Prototipado", "Design Systems", "HTML/CSS"],
  followers: 184,
  likesReceived: 432,
  isFollowing: false,
};

/**
 * Array de proyectos iniciales del usuario
 * 
 * @type {Array<Object>} Lista de proyectos publicados
 */
const initialProjects = [
  {
    id: 1,
    title: "Sistema de diseño accesible",
    description: "Componentes y patrones para aplicaciones educativas.",
    likes: 34,
    comments: 12,
    image: "https://placehold.co/600x400/E9EDF2/5B6E8C?text=Proyecto+1",
  },
  {
    id: 2,
    title: "Landing interactiva para makers",
    description: "Página con microinteracciones y modo oscuro.",
    likes: 67,
    comments: 23,
    image: "https://placehold.co/600x400/ECF3EF/5C7C6E?text=Proyecto+2",
  },
  {
    id: 3,
    title: "App de mentorías (concepto UI)",
    description: "Diseño de alta fidelidad para red de mentores.",
    likes: 42,
    comments: 8,
    image: "https://placehold.co/600x400/F6EEEB/B16E5C?text=Proyecto+3",
  },
];

/**
 * Componente Profile - Perfil de usuario
 * 
 * Muestra la información del perfil incluyendo biografía, habilidades, proyectos,
 * seguidores y estadísticas. Permite editar información personal y gestionar habilidades.
 * Soporta seguir/dejar de seguir usuarios y enviar mensajes.
 * 
 * @component
 * @returns {React.ReactElement} Página de perfil del usuario
 * 
 * @example
 * <Profile />
 * 
 * @todo Implementar carga de perfil de otros usuarios
 * @todo Agregar sistema de mensajería real
 * @todo Mejorar edición de avatar
 */
export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(initialProfileData);
  const [formValues, setFormValues] = useState({
    name: initialProfileData.name,
    role: initialProfileData.role,
    bio: initialProfileData.bio,
  });
  const [skills, setSkills] = useState([...initialProfileData.skills]);
  const [skillDraft, setSkillDraft] = useState("");
  const [projects] = useState(initialProjects);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const enterEditMode = () => {
    setFormValues({
      name: profileData.name,
      role: profileData.role,
      bio: profileData.bio,
    });
    setSkills([...profileData.skills]);
    setIsEditMode(true);
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setSkillDraft("");
  };

  const saveProfile = () => {
    setProfileData((prev) => ({
      ...prev,
      name: formValues.name.trim() || prev.name,
      role: formValues.role.trim() || prev.role,
      bio: formValues.bio.trim() || prev.bio,
      skills: skills.length ? [...skills] : prev.skills,
    }));
    setIsEditMode(false);
    showToast(t("profile.profileUpdated"));
  };

  const toggleFollow = () => {
    setProfileData((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
    showToast(profileData.isFollowing ? t("profile.unfollowSuccess") : t("profile.followSuccess"));
  };

  const handleLogout = () => {
    showToast(t("profile.logout"));
    navigate("/");
  };

  const handleMessage = () => {
    showToast(t("profile.messageSoon"));
  };

  const addSkill = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const newSkill = skillDraft.trim();
    if (!newSkill) return;
    if (skills.includes(newSkill)) {
      showToast(t("profile.skillExists"));
      return;
    }
    if (skills.length >= 15) {
      showToast(t("profile.skillLimit"));
      return;
    }
    setSkills((prev) => [...prev, newSkill]);
    setSkillDraft("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="profile-page">
      <div className="nav-bar">
        <div className="nav-inner">
          <div className="logo">
            <span>Talento</span>
            <span>SinFronteras</span>
          </div>
          <div className="nav-actions">
            <button className="icon-btn" type="button" onClick={() => navigate("/dashboard")}> 
              <FaLayerGroup />
            </button>
            <button className="icon-btn" type="button" onClick={enterEditMode}>
              <FaPen />
            </button>
            <button className="icon-btn" type="button" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="profile-card">
          <div className="profile-cover" />
          <div className="profile-info">
            <div className="avatar-large">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={t("profile.avatarAlt")} />
              ) : (
                <FaUserAstronaut />
              )}
            </div>

            {!isEditMode ? (
              <div className="profile-view-mode">
                <h1 className="profile-name">{profileData.name}</h1>
                <div className="profile-role">{profileData.role}</div>
                <div className="profile-bio">{profileData.bio}</div>
              </div>
            ) : (
              <div className="profile-edit-mode">
                <input
                  type="text"
                  value={formValues.name}
                  placeholder={t("profile.namePlaceholder")}
                  onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
                />
                <input
                  type="text"
                  value={formValues.role}
                  placeholder={t("profile.rolePlaceholder")}
                  onChange={(e) => setFormValues((v) => ({ ...v, role: e.target.value }))}
                />
                <textarea
                  rows="3"
                  value={formValues.bio}
                  placeholder={t("profile.bioPlaceholder")}
                  onChange={(e) => setFormValues((v) => ({ ...v, bio: e.target.value }))}
                />
                <button className="btn-primary" type="button" onClick={saveProfile}>
                  {t("profile.saveChanges")}
                </button>
                <button className="btn-outline" type="button" onClick={exitEditMode}>
                  {t("profile.cancel")}
                </button>
              </div>
            )}

            <div className="profile-stats">
              <div className="stat">
                <div className="stat-number">{projects.length}</div>
                <div className="stat-label">{t("profile.projects")}</div>
              </div>
              <div className="stat">
                <div className="stat-number">{profileData.followers}</div>
                <div className="stat-label">{t("profile.followers")}</div>
              </div>
              <div className="stat">
                <div className="stat-number">{profileData.likesReceived}</div>
                <div className="stat-label">{t("profile.likesReceived")}</div>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn-primary" type="button" onClick={toggleFollow}>
                {profileData.isFollowing ? <FaUserCheck /> : <FaUserPlus />} {profileData.isFollowing ? t("profile.following") : t("profile.follow")}
              </button>
              <button className="btn-outline" type="button" onClick={handleMessage}>
                <FaComment /> {t("profile.message")}
              </button>
            </div>
          </div>
        </div>

        <div className="skills-section">
          <div className="section-title">
            <FaCode /> {t("profile.skills")}
          </div>
          {!isEditMode ? (
            <div className="tags-list">
              {skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="tags-container">
              <div className="tags-list edit-mode-tags">
                {skills.map((skill) => (
                  <span key={skill} className="tag edit-tag">
                    {skill}
                    <FaTimesCircle onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="tags-input"
                value={skillDraft}
                placeholder={t("profile.addSkillPlaceholder")}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={addSkill}
              />
            </div>
          )}
        </div>

        <div className="skills-section">
          <div className="section-title">
            <FaLayerGroup /> {t("profile.projectsPublished")}
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <img className="project-img" src={project.image} alt={project.title} />
                <div className="project-card-content">
                  <h4 className="project-card-title">{project.title}</h4>
                  <p className="project-card-desc">{project.description}</p>
                  <div className="project-stats">
                    <span>
                      <FaHeart /> {project.likes}
                    </span>
                    <span>
                      <FaComment /> {project.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toastMessage && <div className="toast-message">{toastMessage}</div>}
    </div>
  );
}
