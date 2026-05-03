import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaCloudUploadAlt, FaTimesCircle, FaCheckCircle, FaChevronDown } from "react-icons/fa";
import { createProyecto } from "../services/api";
import "../styles/ProjectForm.css";

/**
 * Componente ProjectForm - Página para crear y publicar nuevos p   royectos
 * 
 * Permite a los usuarios crear un proyecto con:
 * - Título, categoría y descripción enriquecida
 * - Carga de multimedia (imágenes y videos)
 * - Etiquetas y habilidades relacionadas
 * - Módulo de colaboración (buscar colaboradores)
 * 
 * @component
 * @returns {React.ReactElement} Formulario completo de creación de proyectos
 * 
 * @example
 * <ProjectForm />
 * 
 * @todo Integrar Quill para editor de texto enriquecido
 * @todo Implementar carga real de multimedia a Cloudinary
 * @todo Conectar con API de proyectos
 */
export default function ProjectForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form state
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [description, setDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillValue, setSkillValue] = useState("");
  const [collaborationOpen, setCollaborationOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleValue, setRoleValue] = useState("");
  const [collabDescription, setCollabDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [errors, setErrors] = useState({ title: "", description: "", link: "" });
  const [loading, setLoading] = useState(false);
  const isWebProject = category === t("projectForm.categories.webDev");
  const [toast, setToast] = useState({ message: "", isError: false, visible: false });

  const mediaInputRef = useRef(null);
  const uploadAreaRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  /**
   * Muestra una notificación toast temporal
   * 
   * @param {string} message - Texto del mensaje
   * @param {boolean} [isError=false] - true si es error
   */
  const showToast = (message, isError = false) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, isError, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  /**
   * Agrega una etiqueta/habilidad a la lista
   * 
   * @param {string} skill - Etiqueta a agregar
   */
  const addSkill = (skill) => {
    const cleaned = skill.trim().replace(/,$/, "");
    if (!cleaned) return;
    if (skills.includes(cleaned)) {
      showToast(t("projectForm.errors.duplicateSkill"), true);
      return;
    }
    if (skills.length >= 12) {
      showToast(t("projectForm.errors.skillsLimit"), true);
      return;
    }
    setSkills((prev) => [...prev, cleaned]);
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  /**
   * Agrega un rol para colaboración
   * 
   * @param {string} role - Rol a agregar
   */
  const addRole = (role) => {
    const cleaned = role.trim().replace(/,$/, "");
    if (!cleaned) return;
    if (roles.includes(cleaned)) {
      showToast(t("projectForm.errors.duplicateRole"), true);
      return;
    }
    if (roles.length >= 8) {
      showToast(t("projectForm.errors.rolesLimit"), true);
      return;
    }
    setRoles((prev) => [...prev, cleaned]);
  };

  const removeRole = (roleToRemove) => {
    setRoles((prev) => prev.filter((role) => role !== roleToRemove));
  };

  /**
   * Maneja la carga de archivos multimedia
   * 
   * @param {File[]} files - Archivos a procesar
   */
  const handleFiles = (files) => {
    for (let file of files) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        if (mediaFiles.length >= 8) {
          showToast(t("projectForm.errors.mediaLimit"), true);
          break;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          setMediaFiles((prev) => [
            ...prev,
            { url: ev.target.result, type: file.type, file: file },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        showToast(t("projectForm.errors.unsupportedFormat"), true);
      }
    }
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Valida los datos del formulario
   * 
   * @returns {boolean} true si todos los campos son válidos
   */
  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", description: "", link: "" };

    if (!projectTitle.trim()) {
      newErrors.title = t("projectForm.errors.titleRequired");
      isValid = false;
    } else if (projectTitle.trim().length < 5) {
      newErrors.title = t("projectForm.errors.titleShort");
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = t("projectForm.errors.descriptionRequired");
      isValid = false;
    } else if (description.trim().length < 20) {
      newErrors.description = t("projectForm.errors.descriptionShort");
      isValid = false;
    }

    if (isWebProject && !projectLink.trim()) {
      newErrors.link = t("projectForm.errors.linkRequired") || "El enlace del proyecto es obligatorio.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Maneja el envío del formulario
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(t("projectForm.errors.checkFields"), true);
      return;
    }

    setLoading(true);

    const projectData = {
      titulo: projectTitle.trim(),
      descripcion: description.trim(),
      tecnologias: skills,
      enlace: projectLink.trim(),
    };

    try {
      const response = await createProyecto(projectData);
      console.log("Proyecto creado:", response.data);
      showToast(t("projectForm.toast.success") || "Proyecto creado correctamente.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
    } catch (error) {
      showToast(t("projectForm.errors.serverError") || "Error al crear el proyecto.", true);
      console.error("Error al crear proyecto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-page">
      <div className="container">
        <div className="project-card">
          <div className="header-back">
            <button
              type="button"
              className="back-link"
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeft /> {t("projectForm.backButton")}
            </button>
          </div>

          <h1>{t("projectForm.title")}</h1>
          <div className="sub">{t("projectForm.subtitle")}</div>

          <form id="projectForm" onSubmit={handleSubmit}>
            {/* Título */}
            <div className="form-group">
              <label>{t("projectForm.titleLabel")} *</label>
              <input
                type="text"
                id="projectTitle"
                placeholder={t("projectForm.titlePlaceholder")}
                maxLength="100"
                value={projectTitle}
                className={errors.title ? "input-error" : ""}
                onChange={(e) => {
                  setProjectTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }
                }}
              />
              <div className="error-msg">{errors.title}</div>
            </div>

            {/* Categoría y Fecha */}
            <div className="row-2cols">
              <div className="form-group">
                <label>{t("projectForm.categoryLabel")} *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">{t("projectForm.selectCategory")}</option>
                  <option>{t("projectForm.categories.design")}</option>
                  <option>{t("projectForm.categories.webDev")}</option>
                  <option>{t("projectForm.categories.illustration")}</option>
                  <option>{t("projectForm.categories.animation")}</option>
                  <option>{t("projectForm.categories.music")}</option>
                  <option>{t("projectForm.categories.maker")}</option>
                  <option>{t("projectForm.categories.writing")}</option>
                  <option>{t("projectForm.categories.other")}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t("projectForm.dateLabel")}</label>
                <input
                  type="text"
                  id="dateRange"
                  placeholder={t("projectForm.datePlaceholder")}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
              </div>
            </div>

            {/* Etiquetas */}
            <div className="form-group">
              <label>
                {t("projectForm.skillsLabel")}
                <span className="label-hint">{t("projectForm.skillsHint")}</span>
              </label>
              <div className="tags-container">
                <div className="tag-list">
                  {skills.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                      <FaTimesCircle
                        className="tag-icon"
                        onClick={() => removeSkill(skill)}
                      />
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  id="skillInput"
                  className="tags-input"
                  placeholder={t("projectForm.skillsPlaceholder")}
                  value={skillValue}
                  onChange={(e) => setSkillValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addSkill(skillValue);
                      setSkillValue("");
                    }
                  }}
                  onBlur={() => {
                    if (skillValue.trim()) {
                      addSkill(skillValue);
                      setSkillValue("");
                    }
                  }}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label>{t("projectForm.descriptionLabel")} *</label>
              <textarea
                id="description"
                placeholder={t("projectForm.descriptionPlaceholder")}
                rows="6"
                value={description}
                className={errors.description ? "input-error" : ""}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }
                }}
              />
              <div className="error-msg">{errors.description}</div>
            </div>

            {isWebProject && (
              <div className="form-group">
                <label>Enlace del proyecto *</label>
                <input
                  type="url"
                  id="projectLink"
                  placeholder="https://github.com/mi-proyecto"
                  value={projectLink}
                  className={errors.link ? "input-error" : ""}
                  onChange={(e) => {
                    setProjectLink(e.target.value);
                    if (errors.link) {
                      setErrors((prev) => ({ ...prev, link: "" }));
                    }
                  }}
                />
                <div className="error-msg">{errors.link}</div>
              </div>
            )}

            {/* Multimedia */}
            <div className="form-group optional-section">
              <button
                type="button"
                className="optional-toggle"
                onClick={() => setShowMediaSection((prev) => !prev)}
              >
                <span>Multimedia (opcional)</span>
                <span className={`optional-arrow ${showMediaSection ? "open" : ""}`}>
                  <FaChevronDown />
                </span>
              </button>
              <p className="optional-note">Próximamente: imágenes y videos cortos.</p>
              {showMediaSection && (
                <div className="optional-panel">
                  <div className="upload-area"
                    ref={uploadAreaRef}
                    onClick={() => alert('Próximamente')/*() => mediaInputRef.current?.click()*/}
                  >
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>{t("projectForm.uploadText")}</p>
                    <input
                      type="file"
                      ref={mediaInputRef}
                      id="mediaInput"
                      accept="image/jpeg,image/png,image/webp,video/mp4"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => handleFiles(Array.from(e.target.files))}
                    />
                  </div>

                  {mediaFiles.length > 0 && (
                    <div className="preview-grid">
                      {mediaFiles.map((item, idx) => (
                        <div key={idx} className="preview-item">
                          {item.type.startsWith("image/") ? (
                            <img src={item.url} alt={`preview-${idx}`} />
                          ) : (
                            <video src={item.url} />
                          )}
                          <div
                            className="remove-media"
                            onClick={() => removeMedia(idx)}
                          >
                            <FaTimesCircle />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Módulo de Colaboración */}
            <div className="form-group">
              <div className="collab-toggle">
                <span>{t("projectForm.collabQuestion")}</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={collaborationOpen}
                    onChange={(e) => setCollaborationOpen(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>

              {collaborationOpen && (
                <div className="collab-fields">
                  <div className="form-group">
                    <label>
                      {t("projectForm.rolesLabel")}
                      <span className="label-hint">
                        {t("projectForm.rolesHint")}
                      </span>
                    </label>
                    <div className="tags-container">
                      <div className="tag-list">
                        {roles.map((role) => (
                          <span key={role} className="tag">
                            {role}
                            <FaTimesCircle
                              className="tag-icon"
                              onClick={() => removeRole(role)}
                            />
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        id="roleInput"
                        className="tags-input"
                        placeholder={t("projectForm.rolesPlaceholder")}
                        value={roleValue}
                        onChange={(e) => setRoleValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addRole(roleValue);
                            setRoleValue("");
                          }
                        }}
                        onBlur={() => {
                          if (roleValue.trim()) {
                            addRole(roleValue);
                            setRoleValue("");
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t("projectForm.collabDescLabel")}</label>
                    <textarea
                      id="collabDesc"
                      rows="3"
                      placeholder={t("projectForm.collabDescPlaceholder")}
                      value={collabDescription}
                      onChange={(e) => setCollabDescription(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <FaCheckCircle /> {loading ? t("projectForm.loading") : t("projectForm.submitButton")}
            </button>
          </form>
        </div>
      </div>

      {toast.visible && (
        <div
          className="toast-message"
          style={toast.isError ? { borderLeft: "4px solid var(--error-main)" } : undefined}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
