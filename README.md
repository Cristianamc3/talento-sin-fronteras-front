# Talento Sin Fronteras - Frontend

Red colaborativa para creadores, makers y mentores.

## Descripción del Proyecto

Plataforma web construida con React que permite a creadores, makers y mentores conectarse, colaborar y compartir proyectos en una comunidad global sin fronteras.

## Stack Tecnológico

- **Frontend**: React 18.2.0 con Create React App
- **Routing**: React Router v6
- **Internacionalización**: react-i18next (ES, EN)
- **Iconos**: React Icons
- **API**: Axios
- **Styling**: CSS3 con scope por página
- **Node**: v16+

## Available Scripts

### `npm start`
Inicia el servidor de desarrollo en [http://localhost:3000](http://localhost:3000)

### `npm run build`
Compila la app para producción en la carpeta `build`

### `npm test`
Ejecuta los tests en modo watch

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.jsx
│   ├── MetricCard.jsx
│   ├── Navbar.jsx
│   ├── ProjectCard.jsx
│   ├── Sidebar.jsx
│   └── LanguageSwitcher.jsx
├── pages/              # Páginas principales
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Profile.jsx
├── services/           # Servicios API
│   └── api.js
├── locales/            # Archivos de traducción
│   ├── es/
│   └── en/
├── styles/             # Estilos CSS por página
├── i18n.js             # Configuración i18n
└── App.js              # Router principal
```

## Documentación de Código

Este proyecto utiliza **JSDoc** para documentar funciones y métodos. La documentación sigue el estándar de comentarios de bloque de JavaScript.

### Formato JSDoc

```javascript
/**
 * Descripción breve de la función
 * 
 * Descripción detallada si es necesaria. Explica qué hace,
 * cuándo usarla y casos especiales.
 * 
 * @param {type} name - Descripción del parámetro
 * @param {type} [optional] - Parámetro opcional
 * @returns {type} Descripción del valor retornado
 * @throws {ErrorType} Descripción del error lanzado
 * 
 * @example
 * // Ejemplo de uso
 * const result = myFunction(param1, param2);
 */
function myFunction(name, optional) {
  // implementation
}
```

### Etiquetas JSDoc Comunes

| Etiqueta | Uso | Ejemplo |
|----------|-----|---------|
| `@param` | Documenta parámetro | `@param {string} email - Email del usuario` |
| `@returns` / `@return` | Documenta valor retornado | `@returns {Promise<Object>} Datos del usuario` |
| `@throws` | Documenta errores lanzados | `@throws {Error} Si email es inválido` |
| `@example` | Muestra ejemplo de uso | Ver formato arriba |
| `@deprecated` | Marca función como obsoleta | `@deprecated Usar newFunction en su lugar` |
| `@async` | Indica función asíncrona | `@async` |
| `@todo` | Marca tareas pendientes | `@todo Implementar validación` |

### Ejemplos en el Proyecto

#### Funciones en API Service

```javascript
/**
 * Autentica un usuario con email/usuario y contraseña
 * 
 * @param {Object} data - Datos de login
 * @param {string} data.identifier - Email o nombre de usuario
 * @param {string} data.password - Contraseña del usuario
 * @returns {Promise<Object>} Respuesta con token y datos del usuario
 * @throws {Error} Si las credenciales son inválidas
 */
export const loginUser = (data) => api.post("/login", data);
```

#### Componentes React

```javascript
/**
 * Componente Login - Autenticación de usuarios
 * 
 * Renderiza formulario de login con validación de email/usuario y contraseña.
 * Soporta modo demo y restablecimiento de contraseña.
 * 
 * @component
 * @returns {React.ReactElement} Página de login
 * 
 * @example
 * <Login />
 */
export default function Login() {
  // implementation
}
```

#### Funciones de Utilidad

```javascript
/**
 * Valida formato de email
 * 
 * Verifica que el email cumpa con el patrón RFC 5322 simplificado.
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} true si es email válido, false en otro caso
 * 
 * @example
 * const isValid = validateEmail("user@example.com");
 * console.log(isValid); // true
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return emailRegex.test(email);
}
```

#### Hooks Personalizados

```javascript
/**
 * Hook para manejar un toast/notificación temporal
 * 
 * @param {number} [duration=3000] - Duración del toast en ms
 * @returns {Object} Objeto con propiedades y métodos del toast
 * @returns {Object.message} Mensaje actual del toast
 * @returns {Object.visible} Si el toast es visible
 * @returns {Function} showToast(message, isError) - Muestra el toast
 * 
 * @example
 * const { message, visible, showToast } = useToast(5000);
 * showToast("Éxito!", false);
 */
function useToast(duration = 3000) {
  // implementation
}
```

## Guías de Desarrollo

### Agregar Documentación a Nuevas Funciones

1. **Escribe la función**
2. **Agrega JSDoc encima** con descripción, parámetros y retorno
3. **Incluye ejemplos** si es complejo
4. **Especifica errores** si la función lanza excepciones

### Estándares de Documentación

- ✅ Documentar funciones públicas y componentes
- ✅ Usar descripciones claras en español o inglés
- ✅ Incluir tipos de datos precisos
- ✅ Agregar ejemplos para funciones no obvias
- ⚠️ Mantener documentación actualizada cuando se cambia el código
- ❌ No documentar código privado trivial

## Internacionalización (i18n)

El proyecto soporta español e inglés. Ver `src/locales/` para archivos de traducción.

**Claves de traducción**: Se organizan por página (login.*, register.*, dashboard.*, profile.*)

```javascript
// Usar traducciones en componentes
const { t } = useTranslation();
<button>{t("login.button")}</button>
```

## Instalación y Setup

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm start

# Compilar para producción
npm run build
```

## Requisitos Previos

- Node.js v16+
- npm v7+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## Contacto y Contribuciones

Para reportar bugs o sugerir features, contáctanos a través de la plataforma.
