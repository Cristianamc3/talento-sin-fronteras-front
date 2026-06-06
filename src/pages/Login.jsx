import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaLock, FaArrowRight, FaFlask } from "react-icons/fa";
import { loginUser } from "../services/api";
import "../styles/Login.css";

/**
 * Componente Login - Página de autenticación de usuarios
 * 
 * Renderiza el formulario de login con validación de email/usuario y contraseña.
 * Soporta modo demo y restablecimiento de contraseña.
 * Incluye notificaciones toast para feedback del usuario.
 * 
 * @component
 * @returns {React.ReactElement} Página de login con formulario de autenticación
 * 
 * @example
 * <Login />
 * 
 * @todo Integrar con API real para autenticación
 * @todo Implementar "Recordarme" con localStorage
 */
export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", isError: false, visible: false });
  const toastTimerRef = useRef(null);
  const navigate = useNavigate();

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
   * Crea una notificación que se auto-cierra después de 3 segundos.
   * Cancela timeouts previos para evitar múltiples toasts superpuestos.
   * 
   * @param {string} message - Texto del mensaje a mostrar
   * @param {boolean} [isError=false] - true si es notificación de error (roja)
   * 
   * @example
   * showToast("¡Login exitoso!");
   * showToast("Credenciales inválidas", true);
   */
  const showToast = (message, isError = false) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, isError, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3000);
  };

  /**
   * Maneja el envío del formulario de login
   * 
   * Valida los datos, muestra errores si es necesario,
   * y llama al endpoint de autenticación de la API.
   * 
   * @param {Event} e - Evento del formulario
   * 
   * @example
   * <form onSubmit={handleSubmit}>...</form>
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast(t("login.errors.requiredFields", "Completa todos los campos"), true);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      
      const { token, user } = response.data || {};

      if (!token) {
        showToast(t("login.errors.serverError", "Error del servidor. Intenta más tarde."), true);
        return;
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      }

      showToast(t("login.toast.welcome"));
      navigate("/dashboard");

    } catch (error) {
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      const message =
        status === 401
          ? t("login.errors.invalidCredentials", "Credenciales inválidas")
          : status === 429
            ? t("login.errors.tooManyRequests", "Demasiados intentos. Espera unos minutos.") // ✅ maneja rate limit
            : status >= 500
              ? t("login.errors.serverError", "Error del servidor. Intenta más tarde.")
              : serverMessage || t("login.errors.serverError", "Error del servidor. Intenta más tarde.");

      showToast(message, true);

    } finally {
      setLoading(false);
    }
  };

  /**
   * Redirige a la página de registro
   * 
   * Muestra mensaje informativo y redirige después de 600ms
   * para dar feedback visual al usuario.
   * 
   * @param {Event} e - Evento del botón
   * 
   * @example
   * <button onClick={handleRegister}>Crear cuenta</button>
   */
  const handleRegister = (e) => {
    e.preventDefault();
    showToast(t("login.toast.redirectRegister"));
    setTimeout(() => {
      navigate("/register");
    }, 600);
  };

  /**
   * Maneja solicitud de restablecimiento de contraseña
   * 
   * En modo demo, solo muestra un toast.
   * En producción, enviaría un email de recuperación.
   * 
   * @param {Event} e - Evento del botón
   * 
   * @example
   * <button onClick={handleForgotPassword}>¿Olvidaste contraseña?</button>
   */
  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast(t("login.toast.forgotPassword"));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="logo-area">
            <div className="logo">
              Talento<span>SinFronteras</span>
            </div>
            <div className="subhead">{t("login.subtitle")}</div>
          </div>

          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t("login.emailLabel")}</label>
              <div className="input-icon">
                <FaEnvelope className="icon" />
                <input
                  type="text"
                  id="loginIdentifier"
                  placeholder={t("login.emailPlaceholder")}
                  autoComplete="email"
                  value={email}
                  className={errors.identifier ? "input-error" : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.identifier) {
                      setErrors((prev) => ({ ...prev, identifier: "" }));
                    }
                  }}
                />
              </div>
              <div className="error-msg" id="identifierError">
                {errors.identifier}
              </div>
            </div>

            <div className="form-group">
              <label>{t("login.passwordLabel")}</label>
              <div className="input-icon">
                <FaLock className="icon" />
                <input
                  type="password"
                  id="password"
                  placeholder={t("login.passwordPlaceholder")}
                  autoComplete="current-password"
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
              <div className="forgot-password">
                <button
                  type="button"
                  id="forgotLink"
                  className="link-button"
                  onClick={handleForgotPassword}
                >
                  {t("login.forgotPassword")}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" id="loginBtn" disabled={loading}>
              <FaArrowRight className="button-icon" /> {loading ? t("login.loading") : t("login.button")}
            </button>
          </form>

          <div className="register-link">
            {t("login.noAccount")} {' '}
            <button
              type="button"
              id="registerLink"
              className="link-button"
              onClick={handleRegister}
            >
              {t("login.registerLink")}
            </button>
          </div>
          <hr />
          <div className="demo-note">
            <FaFlask className="demo-icon" /> {t("login.demoNote")}
          </div>
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

