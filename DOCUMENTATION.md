# Documentación Detallada - Talento Sin Fronteras Frontend

## Tabla de Contenidos

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Servicios API](#servicios-api)
3. [Componentes Principales](#componentes-principales)
4. [Páginas](#páginas)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Utilidades](#utilidades)
7. [Convenciones de Código](#convenciones-de-código)

---

## Estructura del Proyecto

```
talento-sin-fronteras-front/
├── public/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── Button.jsx
│   │   ├── MetricCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── Sidebar.jsx
│   │   └── LanguageSwitcher.jsx
│   ├── pages/                # Páginas principales
│   │   ├── Login.jsx         # Autenticación
│   │   ├── Register.jsx      # Registro de usuarios
│   │   ├── Dashboard.jsx     # Feed principal
│   │   └── Profile.jsx       # Perfil de usuario
│   ├── services/
│   │   └── api.js            # Configuración de Axios
│   ├── locales/              # Archivos de traducción
│   │   ├── es/translation.json
│   │   └── en/translation.json
│   ├── styles/               # CSS por página
│   │   ├── App.css
│   │   ├── Dashboard.css
│   │   ├── Login.css
│   │   ├── Profile.css
│   │   ├── Register.css
│   │   ├── global.css
│   │   └── index.css
│   ├── App.js                # Router principal
│   ├── i18n.js               # Configuración de i18n
│   ├── index.js              # Entry point
│   └── reportWebVitals.js
├── package.json
└── README.md
```

---

## Servicios API

### Archivo: `src/services/api.js`

Configura la instancia de Axios con la URL base del backend.

#### Funciones Exportadas

##### `loginUser(data)`

Autentica un usuario con email/usuario y contraseña.

**Parámetros:**
```javascript
{
  identifier: "user@example.com",  // Email o nombre de usuario
  password: "password123"          // Contraseña
}
```

**Respuesta esperada:**
```javascript
{
  token: "jwt_token_aqui",
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "creator"
  }
}
```

**Ejemplo de uso:**
```javascript
import { loginUser } from '../services/api';

const handleLogin = async () => {
  try {
    const response = await loginUser({
      identifier: email,
      password: password
    });
    console.log("Token:", response.data.token);
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};
```

---

##### `registerUser(data)`

Crea una nueva cuenta de usuario.

**Parámetros:**
```javascript
{
  name: "John Doe",                      // Nombre completo
  email: "john@example.com",             // Email único
  password: "password123",               // Mínimo 6 caracteres
  role: "creator",                       // "creator", "mentor", "company"
  skills: ["React", "Design"],           // Opcional
  avatar: File                           // Opcional
}
```

**Respuesta esperada:**
```javascript
{
  message: "User registered successfully",
  userId: 42,
  email: "john@example.com"
}
```

**Ejemplo de uso:**
```javascript
const newUser = await registerUser({
  name: "Maria García",
  email: "maria@example.com",
  password: "secure123",
  role: "mentor",
  skills: ["Diseño", "Figma"]
});
```

---

##### `getProjects()`

Obtiene la lista de proyectos disponibles en la plataforma.

**Respuesta esperada:**
```javascript
[
  {
    id: 1,
    title: "Proyecto 1",
    description: "Descripción...",
    author: "Mariana López",
    likes: 87,
    comments: 24,
    collaborators: 6
  },
  // ... más proyectos
]
```

**Ejemplo de uso:**
```javascript
const { data: projects } = await getProjects();
projects.forEach(project => {
  console.log(`${project.title} by ${project.author}`);
});
```

---

## Componentes Principales

### Button.jsx

Botón reutilizable con múltiples variantes.

**Props:**
```javascript
{
  children: React.ReactNode,   // Contenido del botón
  onClick: Function,           // Función al hacer click
  variant: String,             // "primary" | "secondary" | "outline"
  disabled: Boolean,           // Deshabilita el botón
  loading: Boolean             // Muestra indicador de carga
}
```

**Ejemplo:**
```javascript
<Button variant="primary" onClick={handleSubmit} loading={isLoading}>
  Enviar
</Button>
```

---

### ProjectCard.jsx

Tarjeta que muestra información de un proyecto.

**Props:**
```javascript
{
  project: Object,             // Datos del proyecto
  onLike: Function,            // Callback al dar like
  onCollaborate: Function      // Callback para colaborar
}
```

---

### LanguageSwitcher.jsx

Selector de idioma (Español/Inglés).

**Props:**
```javascript
{
  onLanguageChange: Function   // Callback al cambiar idioma (opcional)
}
```

---

## Páginas

### Login.jsx

**Funcionalidades:**
- ✅ Validación de email/usuario y contraseña
- ✅ Notificaciones toast
- ✅ Restablecimiento de contraseña (demo)
- ✅ Redirección a registro
- ✅ Internacionalizado (ES/EN)

**Estados:**
```javascript
{
  email: "",                   // Email o usuario
  password: "",                // Contraseña
  errors: {                    // Errores de validación
    identifier: "",
    password: ""
  },
  loading: false,              // Estado de carga
  toast: {                     // Notificaciones
    message: "",
    isError: false,
    visible: false
  }
}
```

**Funciones Clave:**

```javascript
// Valida los datos del formulario
validateLogin() -> boolean

// Muestra una notificación temporal
showToast(message: string, isError: boolean) -> void

// Simula un login (mock)
mockLogin(identifier: string, password: string) -> void

// Maneja el envío del formulario
handleSubmit(event: Event) -> void
```

---

### Register.jsx

**Funcionalidades:**
- ✅ Formulario completo con avatar
- ✅ Selección de rol (Creador, Mentor, Empresa)
- ✅ Gestión de habilidades con tags
- ✅ Validación en tiempo real
- ✅ Internacionalizado (ES/EN)

**Estados:**
```javascript
{
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "creator",
  skills: [],
  skillValue: "",
  termsAccepted: false,
  avatarPreview: null,
  avatarBase64: null,
  errors: {},
  loading: false,
  toast: {}
}
```

---

### Dashboard.jsx

**Funcionalidades:**
- ✅ Feed con múltiples tabs (Feed, Proyectos, Colaboraciones, Mentoría)
- ✅ Búsqueda de proyectos
- ✅ Sistema de likes
- ✅ Carga infinita de proyectos
- ✅ Widgets laterales (tendencias, destacados, colaboraciones)
- ✅ Notificaciones
- ✅ Solicitud de colaboración

**Tabs Disponibles:**
- `feed` - Feed general
- `proyectos` - Proyectos publicados
- `colaboraciones` - Espacios para colaborar
- `mentoria` - Sesiones de mentoría

**Estados:**
```javascript
{
  activeTab: "feed",           // Tab activo
  projects: [],                // Array de proyectos
  search: "",                  // Búsqueda
  toast: {},                   // Notificaciones
  notifCount: 0,               // Número de notificaciones
  loadingMore: false           // Cargando más proyectos
}
```

**Funciones Clave:**

```javascript
// Maneja el like de un proyecto
handleLike(projectId: number) -> void

// Filtra proyectos por búsqueda
filteredProjects() -> Array

// Muestra notificación temporal
showToast(message: string) -> void

// Carga infinita al scroll
onScroll() -> void
```

---

### Profile.jsx

**Funcionalidades:**
- ✅ Visualización y edición de perfil
- ✅ Gestión de habilidades
- ✅ Estadísticas de usuario (followers, likes)
- ✅ Galería de proyectos
- ✅ Seguir/dejar de seguir
- ✅ Logout
- ✅ Internacionalizado (ES/EN)

**Estados:**
```javascript
{
  profileData: {               // Datos del perfil
    name: "",
    role: "",
    bio: "",
    avatar: null,
    skills: [],
    followers: 0,
    likesReceived: 0,
    isFollowing: false
  },
  isEditMode: false,           // Modo edición
  formValues: {},              // Valores del formulario
  skills: [],                  // Habilidades actuales
  skillDraft: "",              // Habilidad siendo editada
  projects: []                 // Proyectos del usuario
}
```

**Funciones Clave:**

```javascript
// Activa modo de edición
enterEditMode() -> void

// Cancela edición y descarta cambios
exitEditMode() -> void

// Guarda cambios del perfil
saveProfile() -> void

// Añade una habilidad
addSkill(event: KeyboardEvent) -> void

// Elimina una habilidad
removeSkill(skill: string) -> void

// Toggle seguir/dejar de seguir
toggleFollow() -> void

// Logout del usuario
handleLogout() -> void
```

---

## Hooks Personalizados

### useToast()

Hook personalizado para manejar notificaciones temporales.

```javascript
/**
 * Hook para manejar un toast/notificación temporal
 * 
 * @param {number} duration - Duración en ms (default: 3000)
 * @returns {Object} { message, visible, showToast }
 */
const { message, visible, showToast } = useToast(5000);

showToast("¡Éxito!");
showToast("Error!", true);  // Parámetro isError
```

---

## Utilidades

### Validación de Email

```javascript
const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;

const isValidEmail = (email) => {
  return emailRegex.test(email);
};

// Uso
if (isValidEmail(userEmail)) {
  // Email válido
}
```

---

## Internacionalización (i18n)

### Configuración

Archivo: `src/i18n.js`

Soporta dos idiomas:
- **Español (es)** - Por defecto
- **Inglés (en)**

### Estructura de Claves

Las claves están organizadas por página/módulo:

```json
{
  "login": {
    "subtitle": "...",
    "emailLabel": "...",
    "errors": {
      "requiredEmail": "..."
    }
  },
  "register": {
    "subtitle": "...",
    "nameLabel": "..."
  },
  "dashboard": {
    "searchPlaceholder": "...",
    "tabs": {
      "feed": "Feed"
    }
  },
  "profile": {
    "edit": "Editar perfil",
    "skills": "Habilidades"
  }
}
```

### Usar Traducciones

```javascript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('login.subtitle')}</h1>;
}
```

### Cambiar Idioma

```javascript
import i18n from 'i18next';

// Cambiar a inglés
i18n.changeLanguage('en');

// Cambiar a español
i18n.changeLanguage('es');
```

---

## Convenciones de Código

### Nombres de Variables

- ✅ `isLoading` - Booleans con prefijo "is"
- ✅ `handleClick` - Event handlers con prefijo "handle"
- ✅ `fetchUsers` - Promesas/async con prefijo "fetch"
- ✅ `userData` - Sustantivos claros para datos

### Estructura de Componentes

```javascript
/**
 * [JSDoc del componente]
 */
export default function MyComponent({ prop1, prop2 }) {
  // Imports y hooks
  const [state, setState] = useState(null);
  const { t } = useTranslation();
  
  // Effects
  useEffect(() => {
    // lógica
  }, [dependencies]);
  
  // Funciones internas (documentadas)
  /**
   * [JSDoc de la función]
   */
  const handleEvent = (e) => {
    // lógica
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### CSS Scoping

- Cada página tiene su propio archivo CSS
- Las clases están prefijadas con el nombre de la página:
  - `.dashboard-page` en Dashboard.css
  - `.login-page` en Login.css
  - `.profile-page` en Profile.css
  - `.register-page` en Register.css

```css
/* Dashboard.css */
.dashboard-page {
  /* Estilos del dashboard */
}

.dashboard-page .widget {
  /* Estilos de widgets */
}
```

---

## Troubleshooting

### Error: "Cannot find module 'react-i18next'"

**Solución:** Ejecutar `npm install react-i18next i18next --legacy-peer-deps`

### Los estilos de una página se aplican a otra

**Solución:** Verificar que el className de la página wrapper esté correctamente prefijado:
```javascript
// Correcto
<div className="dashboard-page">
  {/* contenido */}
</div>

// Incorrecto
<div>
  {/* contenido */}
</div>
```

### Las traducciones no actualizan

**Solución:** Asegurar que el componente use el hook `useTranslation()`:
```javascript
const { t } = useTranslation();
// Luego usar: t('key')
```

---

## Próximas Mejoras

- [ ] Integración con API real
- [ ] Sistema de caché
- [ ] Optimización de imágenes
- [ ] Tests unitarios
- [ ] Dark mode
- [ ] PWA support
- [ ] Analytics

---

**Última actualización:** Mayo 2026
