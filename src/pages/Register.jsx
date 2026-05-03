import { useEffect, useRef, useState } from "react";
import {
  FaUserAstronaut,
  FaCamera,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaPalette,
  FaChalkboardTeacher,
  FaBuilding,
  FaTimesCircle,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerUser } from "../services/api";
import "../styles/Register.css";

/**
 * Patrón regex para validar direcciones de email
 * Compatible con RFC 5322 simplificado
 * @type {RegExp}
 */
const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;

/**
 * Componente Register - Página de registro de nuevos usuarios
 * 
 * Permite crear una nueva cuenta con validación de datos.
 * Soporta selección de avatar, múltiples roles y habilidades.
 * Incluye validación en tiempo real y manejo de errores.
 * 
 * @component
 * @returns {React.ReactElement} Página de registro con formulario completo
 * 
 * @example
 * <Register />
 * 
 * @todo Mejorar validación de email
 * @todo Implementar subida real de avatares
 */
export default function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("creador");
  const [skills, setSkills] = useState([]);
  const [skillValue, setSkillValue] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    terms: "",
    tags: "",
  });
  const [toast, setToast] = useState({ message: "", isError: false, visible: false });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message, isError = false) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, isError, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast(t("register.toast.invalidAvatar"), true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      setAvatarPreview(result);
      setAvatarBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const addSkill = (skill) => {
    const cleaned = skill.trim().replace(/,$/, "");
    if (!cleaned) return;
    if (skills.includes(cleaned)) {
      showToast(t("register.errors.tagsDuplicate"), true);
      return;
    }
    if (skills.length >= 12) {
      showToast(t("register.errors.tagsLimit"), true);
      return;
    }
    setSkills((prev) => [...prev, cleaned]);
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      terms: "",
      tags: "",
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = t("register.errors.nameRequired");
      isValid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = t("register.errors.nameShort");
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = t("register.errors.emailRequired");
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t("register.errors.emailInvalid");
      isValid = false;
    }

    if (!password) {
      newErrors.password = t("register.errors.passwordRequired");
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t("register.errors.passwordShort");
      isValid = false;
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = t("register.errors.passwordMatch");
      isValid = false;
    }

    if (!role) {
      newErrors.role = t("register.errors.roleRequired");
      isValid = false;
    }

    if (!termsAccepted) {
      newErrors.terms = t("register.errors.termsRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      showToast("⚠️ Revisa los campos obligatorios", true);
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        nombre: name.trim(),
        email: email.trim(),
        password: password,
        rol: role,
        skills: skills,
        avatar: avatarBase64,
      });

      const { token, user } = response.data || {};

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      }

      showToast(t("register.toast.success"));
      setTimeout(() => navigate("/dashboard"), 1800);

    } catch (error) {
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      const message =
        status === 409
          ? t("register.errors.emailExists", "El email ya está registrado")
          : status === 400
            ? serverMessage || t("register.errors.invalidData", "Datos inválidos")
            : status >= 500
              ? t("register.toast.serverError", "Error del servidor. Intenta más tarde.")
              : serverMessage || t("register.toast.serverError", "Error del servidor.");

      showToast(message, true);
      console.error("Error en registro:", error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-card">
          <div className="logo-area">
            <div className="logo">
              Talento<span>SinFronteras</span>
            </div>
            <div className="subhead">{t("register.subtitle")}</div>
          </div>

          <form id="registerForm" onSubmit={handleSubmit}>
            <div className="avatar-upload">
              <div className="avatar-preview" id="avatarPreview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={t("register.uploadAvatar")} />
                ) : (
                  <FaUserAstronaut />
                )}
              </div>
              <button
                type="button"
                className="avatar-upload-btn"
                id="uploadAvatarBtn"
                onClick={handleAvatarClick}
              >
                <FaCamera /> {t("register.uploadAvatar")}
              </button>
              <input
                type="file"
                id="avatarFile"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </div>

            <div className="form-group">
              <label>{t("register.nameLabel")}</label>
              <div className="input-icon">
                <FaUser className="icon" />
                <input
                  type="text"
                  id="fullname"
                  placeholder={t("register.namePlaceholder")}
                  autoComplete="name"
                  value={name}
                  className={errors.name ? "input-error" : ""}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                />
              </div>
              <div className="error-msg" id="nameError">
                {errors.name}
              </div>
            </div>

            <div className="form-group">
              <label>{t("register.emailLabel")}</label>
              <div className="input-icon">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder={t("register.emailPlaceholder")}
                  autoComplete="email"
                  value={email}
                  className={errors.email ? "input-error" : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                />
              </div>
              <div className="error-msg" id="emailError">
                {errors.email}
              </div>
            </div>

            <div className="row-2cols">
              <div className="form-group">
                <label>{t("register.passwordLabel")}</label>
                <div className="input-icon">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    id="password"
                    placeholder={t("register.passwordPlaceholder")}
                    value={password}
                    className={errors.password ? "input-error" : ""}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                  />
                </div>
                <div className="error-msg" id="passwordError">
                  {errors.password}
                </div>
              </div>

              <div className="form-group">
                <label>{t("register.confirmPasswordLabel")}</label>
                <div className="input-icon">
                  <FaCheckCircle className="icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder={t("register.passwordPlaceholder")}
                    value={confirmPassword}
                    className={errors.confirmPassword ? "input-error" : ""}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }
                    }}
                  />
                </div>
                <div className="error-msg" id="confirmError">
                  {errors.confirmPassword}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t("register.roleQuestion")}</label>
              <div className="role-selector" id="roleSelector">
                <button
                  type="button"
                  className={`role-option ${role === "visitante" ? "active" : ""}`}
                  data-role="visitante"
                  onClick={() => setRole("visitante")}
                >
                  <FaUser /> {t("register.roleVisitor")}
                </button>
                <button
                  type="button"
                  className={`role-option ${role === "creador" ? "active" : ""}`}
                  data-role="creador"
                  onClick={() => setRole("creador")}
                >
                  <FaPalette /> {t("register.roleCreator")}
                </button>
                <button
                  type="button"
                  className={`role-option ${role === "mentor" ? "active" : ""}`}
                  data-role="mentor"
                  onClick={() => setRole("mentor")}
                >
                  <FaChalkboardTeacher /> {t("register.roleMentor")}
                </button>
                <button
                  type="button"
                  className={`role-option ${role === "empresa" ? "active" : ""}`}
                  data-role="empresa"
                  onClick={() => setRole("empresa")}
                >
                  <FaBuilding /> {t("register.roleCompany")}
                </button>
              </div>
              <input type="hidden" id="selectedRole" value={role} />
              <div className="error-msg" id="roleError">
                {errors.role}
              </div>
            </div>

            <div className="form-group">
              <label>{t("register.skillsLabel")}</label>
              <div className="tags-container" id="tagsContainer">
                <div id="tagList" className="tag-list">
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
                  placeholder={t("register.skillsPlaceholder")}
                  value={skillValue}
                  onChange={(e) => {
                    setSkillValue(e.target.value);
                    if (errors.tags) {
                      setErrors((prev) => ({ ...prev, tags: "" }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addSkill(skillValue);
                      setSkillValue("");
                    }
                  }}
                  onBlur={() => {
                    addSkill(skillValue);
                    setSkillValue("");
                  }}
                />
              </div>
              <div className="error-msg" id="tagsError">
                {errors.tags}
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }
                }}
              />
              <label htmlFor="termsCheckbox">
                {t("register.termsTextPrefix")} {' '}
                <button
                  type="button"
                  className="link-button"
                  style={{ color: "var(--primary-main)" }}
                >
                  {t("register.termsLink")}
                </button>{' '}
                {t("register.termsTextSuffix")}
              </label>
            </div>
            <div className="error-msg" id="termsError">
              {errors.terms}
            </div>

            <button type="submit" className="btn-primary" id="submitBtn" disabled={loading}>
              <FaUserPlus /> {loading ? t("register.loading") : t("register.button")}
            </button>
          </form>

          <div className="login-link">
            {t("register.haveAccount")}{' '}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/')}
            >
              {t("register.loginLink")}
            </button>
          </div>
          <hr />
          <div style={{ fontSize: "0.7rem", textAlign: "center", color: "var(--text-tertiary)" }}>
            {t("register.termsNote")}
          </div>
        </div>
      </div>

      {toast.visible && (
        <div className="toast-message" style={toast.isError ? { borderLeft: "4px solid var(--error-main)" } : undefined}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
