# Configuración de Ambientes

Esta carpeta contiene la configuración para gestionar diferentes ambientes de la aplicación (desarrollo y producción).

## Archivos

### `environment.js`
Archivo principal de configuración que:
- Detecta automáticamente el ambiente actual (desarrollo o producción)
- Proporciona la URL base de la API según el ambiente
- Expone funciones auxiliares para construir URLs completas

## Cómo Funciona

### Variables de Entorno

El proyecto usa variables de entorno definidas en:
- `.env.development` - Para desarrollo local
- `.env.production` - Para producción/deploy

⚠️ **Importante**: Los archivos `.env.*` deben estar en la raíz del proyecto.

### Variables Disponibles

```
REACT_APP_API_BASE_URL_DEV    → URL base para desarrollo (http://localhost:4000)
REACT_APP_API_BASE_URL_PROD   → URL base para producción (https://tu-api.onrender.com)
REACT_APP_DEBUG               → Bandera para logs de debug
```

> **Nota**: En React, solo las variables que comienzan con `REACT_APP_` están disponibles en el navegador.

## Uso en la Aplicación

### En `src/services/api.js`

```javascript
import { getApiBaseUrl } from "../config/environment";

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
});
```

### Ejemplos de URLs Generadas

#### Desarrollo (`npm start`)
```
Ambiente: development
URL Base: http://localhost:4000
Endpoint: /auth/login
URL Final: http://localhost:4000/api/auth/login
```

#### Producción (`npm run build`)
```
Ambiente: production
URL Base: https://proyecto-de-software-tatiana-cabrera.onrender.com
Endpoint: /auth/login
URL Final: https://proyecto-de-software-tatiana-cabrera.onrender.com/api/auth/login
```

## Importar en Componentes

Si necesitas la configuración en un componente:

```javascript
import { config, getApiBaseUrl, buildApiUrl } from "../config/environment";

// Obtener la URL base
const baseUrl = getApiBaseUrl();

// Construir una URL completa
const loginUrl = buildApiUrl("/auth/login");

// Acceder a la configuración
if (config.isDevelopment) {
  console.log("Modo desarrollo activado");
}
```

## Scripts npm

- `npm start` → Inicia en **desarrollo** con `.env.development`
- `npm run build` → Construye para **producción** usando `.env.production`

## Agregar Más Ambientes (Opcional)

Si necesitas agregar ambientes como "staging", puedes:

1. Crear `.env.staging` con las variables correspondientes
2. Actualizar `environment.js` para soportar staging
3. Usar `cross-env` en `package.json` para establecer `NODE_ENV`

## Troubleshooting

### Las variables de entorno no funcionan

- Asegúrate de que las variables empiezan con `REACT_APP_`
- Reinicia el servidor de desarrollo después de cambiar `.env`
- En navegador, verifica en DevTools → Console → `process.env.REACT_APP_*`

### URLs no actualizadas en producción

- Verifica que `.env.production` está en la raíz del proyecto
- Ejecuta `npm run build` (no `npm start`) antes de hacer deploy
- Confirma que la variable `REACT_APP_API_BASE_URL_PROD` es correcta
