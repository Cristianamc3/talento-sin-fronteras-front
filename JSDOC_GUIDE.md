# Guía de Documentación JSDoc

## Introducción

Este proyecto utiliza **JSDoc** para documentar funciones, componentes y métodos. Mantener la documentación actualizada es esencial para que el código sea mantenible y comprensible.

## ¿Por qué documentar?

- 📖 **Legibilidad**: Otros desarrolladores entienden rápidamente qué hace el código
- 🔍 **IDE Support**: Muchos editores (VS Code) muestran la documentación en autocompletado
- 🐛 **Debugging**: Facilita la identificación de errores
- 🔄 **Mantenimiento**: Cambios futuros son menos propensos a romper el código

## Formato Básico

Cada documento JSDoc comienza con `/**` y termina con `*/`:

```javascript
/**
 * Descripción breve de la función
 * 
 * Descripción más detallada si es necesaria.
 * Puede abarcar múltiples líneas.
 * 
 * @param {type} name - Descripción del parámetro
 * @returns {type} Descripción del retorno
 */
function myFunction(name) {
  // implementation
}
```

## Etiquetas Comunes

### @param

Documenta los parámetros de una función.

```javascript
/**
 * Calcula la suma de dos números
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @returns {number} La suma de a y b
 */
function add(a, b) {
  return a + b;
}
```

**Tipos Comunes:**
- `{string}` - Texto
- `{number}` - Números
- `{boolean}` - Verdadero/Falso
- `{Array}` - Array
- `{Object}` - Objeto
- `{Function}` - Función
- `{Promise<T>}` - Promesa que retorna tipo T
- `{React.ReactElement}` - Componente React

**Parámetros Opcionales:**

```javascript
/**
 * @param {number} [timeout=3000] - Tiempo en ms (opcional, default 3000)
 */
function wait(timeout = 3000) {}
```

### @returns / @return

Documenta el valor de retorno.

```javascript
/**
 * @returns {Promise<Object>} Datos del usuario
 */
async function getUser(id) {
  // ...
}

/**
 * @returns {boolean} true si es válido
 */
function validate(data) {
  // ...
}
```

### @throws

Documenta errores que puede lanzar la función.

```javascript
/**
 * @throws {Error} Si el email no es válido
 * @throws {TypeError} Si el parámetro no es string
 */
function validateEmail(email) {
  if (typeof email !== 'string') {
    throw new TypeError('email debe ser string');
  }
}
```

### @example

Muestra ejemplos de uso.

```javascript
/**
 * Obtiene un usuario por ID
 * 
 * @param {number} id - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 * 
 * @example
 * // Obtener usuario con ID 1
 * const user = await getUser(1);
 * console.log(user.name);
 * 
 * @example
 * // Con error handling
 * try {
 *   const user = await getUser(999);
 * } catch (error) {
 *   console.error('Usuario no encontrado');
 * }
 */
async function getUser(id) {
  // ...
}
```

### @deprecated

Marca una función como obsoleta.

```javascript
/**
 * @deprecated Usar newFunction() en su lugar
 * @example
 * // Usar esto:
 * newFunction();
 * 
 * // En lugar de:
 * oldFunction();
 */
function oldFunction() {
  // ...
}
```

### @async

Indica que es una función asíncrona.

```javascript
/**
 * Carga datos del servidor
 * @async
 * @returns {Promise<Array>} Array de datos
 */
async function loadData() {
  // ...
}
```

### @todo

Marca tareas pendientes.

```javascript
/**
 * Valida email
 * 
 * @param {string} email
 * @returns {boolean}
 * 
 * @todo Soportar emails internacionales (IDN)
 * @todo Implementar validación con DNS
 */
function validateEmail(email) {
  // ...
}
```

## Documentar Componentes React

```javascript
/**
 * Componente que muestra una tarjeta de usuario
 * 
 * Renderiza información del usuario incluyendo avatar, nombre,
 * rol y botones de acción (follow, message, etc).
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Datos del usuario
 * @param {string} props.user.name - Nombre del usuario
 * @param {string} props.user.avatar - URL del avatar
 * @param {Function} [props.onFollow] - Callback al seguir
 * @returns {React.ReactElement} Tarjeta de usuario renderizada
 * 
 * @example
 * const user = {
 *   name: "John Doe",
 *   avatar: "https://...",
 *   role: "Creator"
 * };
 * <UserCard user={user} onFollow={handleFollow} />
 */
export default function UserCard({ user, onFollow }) {
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Documentar Métodos de Objeto

```javascript
/**
 * Objeto de configuración de la API
 * 
 * @typedef {Object} APIConfig
 * @property {string} baseURL - URL base de la API
 * @property {number} timeout - Timeout en ms
 * @property {Object} headers - Headers HTTP por defecto
 */

/**
 * Inicializa la conexión con la API
 * 
 * @param {APIConfig} config - Configuración
 * @returns {Object} Instancia de la API
 */
function initAPI(config) {
  // ...
}
```

## Documentar Funciones Flecha

```javascript
/**
 * Filtra usuarios activos
 * @param {Array<Object>} users - Array de usuarios
 * @returns {Array<Object>} Usuarios con status "active"
 */
const filterActiveUsers = (users) =>
  users.filter(user => user.status === 'active');
```

## Documentar Hooks Personalizados

```javascript
/**
 * Hook para manejar estado de formulario
 * 
 * Proporciona métodos para cambiar valores y reiniciar el formulario.
 * 
 * @param {Object} initialValues - Valores iniciales
 * @returns {Object} Objeto con métodos y estados
 * @returns {Object.values} Valores actuales del formulario
 * @returns {Function} values.setValue - Cambia un valor
 * @returns {Function} values.reset - Reinicia el formulario
 * 
 * @example
 * const form = useForm({ name: '', email: '' });
 * form.setValue('name', 'John');
 * form.reset();
 */
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  return {
    values,
    setValue: (field, value) => {
      setValues(prev => ({ ...prev, [field]: value }));
    },
    reset: () => setValues(initialValues)
  };
}
```

## Checklist de Documentación

Antes de hacer commit, verifica:

- ✅ ¿Todas las funciones públicas están documentadas?
- ✅ ¿Todos los parámetros tienen descripción?
- ✅ ¿El tipo de retorno está especificado?
- ✅ ¿Hay ejemplos para funciones complejas?
- ✅ ¿Los tipos de datos son correctos?
- ✅ ¿Los componentes tienen `@component`?
- ✅ ¿Se documentaron los errores posibles?

## Consejos Prácticos

### ❌ Malo: Documentación genérica

```javascript
/**
 * Procesa datos
 * @param {Object} data
 * @returns {Object}
 */
function processData(data) {}
```

### ✅ Bueno: Documentación específica

```javascript
/**
 * Valida y transforma datos de usuario para guardar en BD
 * 
 * Verifica campos requeridos, sanitiza HTML y normaliza emails.
 * 
 * @param {Object} data - Datos del formulario
 * @param {string} data.name - Nombre completo (requerido)
 * @param {string} data.email - Email único (requerido)
 * @param {Array<string>} [data.skills] - Habilidades (opcional)
 * @returns {Object} Datos validados y transformados
 * @throws {Error} Si faltan campos requeridos
 * 
 * @example
 * const user = processUserData({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   skills: ["React", "Node"]
 * });
 */
function processUserData(data) {}
```

## Integración con IDE

### VS Code

1. Instala la extensión **JSDoc Comments** (opcional)
2. Al escribir `/**` y presionar Enter, se genera automáticamente el template
3. Completa los campos necesarios

### Configuración en Editor

Añade a `.vscode/settings.json`:

```json
{
  "javascript.preferences.jsdoc.generateComments": true,
  "editor.formatOnSave": true
}
```

## Validar Documentación

Usa herramientas como:

- **ESLint Plugin**: eslint-plugin-jsdoc
- **JSDoc Linter**: jsdoc
- **VS Code Intellisense**: Verifica tipos automáticamente

## Recursos Adicionales

- [JSDoc Official Docs](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Google Style Guide](https://google.github.io/styleguide/tsguide.html)

---

**Recuerda:** Documentación clara = código mejor mantenido 📚
