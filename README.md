# Stock Scanner — Detección de acciones cercanas a máximos históricos

> **TFM — Máster en Desarrollo Web Full Stack con IA**  
> Autor: Antonio Martín P. · Febrero 2026  
> Repositorio: [github.com/AntonioMartinP/stock-scanner](https://github.com/AntonioMartinP/stock-scanner)

---

## Descripción general

**Stock Scanner** es una aplicación web SSR (Server-Side Rendering) que permite a inversores y analistas detectar, de forma rápida y visual, qué acciones de los principales índices bursátiles europeos se encuentran cerca de su máximo histórico (**ATH — All-Time High**) o de su máximo de las últimas 52 semanas.

### Problema que resuelve

Identificar oportunidades técnicas en un mercado con decenas de valores requiere revisar gráfico por gráfico. Stock Scanner centraliza ese proceso: en una sola pantalla muestra todos los valores del índice seleccionado ordenados por su distancia al ATH, permitiendo priorizar el análisis en segundos.

### Qué hace la aplicación

- Consulta datos históricos de precios desde proveedores externos configurables.
- Calcula el ATH real o el ATH de 52 semanas para cada valor del índice.
- Muestra una tabla ordenable con el estado de cada acción respecto a su máximo.
- Abre un panel lateral con métricas detalladas y gráfico interactivo de TradingView.
- Protege el acceso al scanner mediante autenticación con Firebase.
- Soporta español e inglés con rutas internacionalizadas.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework web | Next.js (App Router, SSR) | 16.1.6 |
| Lenguaje | TypeScript | ^5 |
| UI | React | 19.2.3 |
| Estilos | Tailwind CSS | ^4 |
| Internacionalización | next-intl | ^4.8.2 |
| Autenticación | Firebase Auth | ^12.9.0 |
| Datos de mercado | yahoo-finance2 | ^3.13.0 |
| Validación | Zod | ^4.3.6 |
| Tests | Vitest | ^4.0.18 |
| Test utilities | Testing Library (React + DOM) | ^16 / ^10 |
| Linting | ESLint + eslint-config-next | ^10 |
| Compilador React | React Compiler (Babel plugin) | 1.0.0 |

### Proveedores de datos configurables

| `source` | Implementación | Estado |
|---|---|---|
| `yahoo` | `yahooProvider.ts` | Activo. Funcionamiento 100% OK |
| `alphavantage` | `alphaVantageProvider.ts` | Activo. Sin datos debido a acceso a API de pago |
| `stooq` | `mockProvider.ts` | Activo. Mock (datos demo) |

---

## Instalación y ejecución

### Requisitos previos

- **Node.js** >= 20 LTS
- **npm** >= 10 (incluido con Node.js)
- Cuenta en [Firebase](https://firebase.google.com/) (para autenticación)
- Clave de API de [Alpha Vantage](https://www.alphavantage.co/) (opcional, solo si `source=alphavantage`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/AntonioMartinP/stock-scanner.git
cd stock-scanner
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# Firebase — obligatorio para autenticación
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Alpha Vantage — opcional (solo si usas source=alphavantage)
ALPHA_VANTAGE_API_KEY=tu_clave_alpha_vantage
```

> Yahoo Finance no requiere clave de API. Alpha Vantage tiene un límite de 25 peticiones/día en el tier gratuito.

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.
La ruta raíz redirige automáticamente al locale por defecto: `http://localhost:3000/es`.

### 5. Compilar y ejecutar en producción

```bash
npm run build
npm run start
```

### 6. Ejecutar los tests

```bash
npm test
```

### 7. Linting

```bash
npm run lint
```

---

## Estructura del proyecto

```
stock-scanner/
├── src/
│   ├── app/                         # App Router de Next.js
│   │   ├── [locale]/                # Rutas internacionalizadas (es / en)
│   │   │   ├── layout.tsx           # Layout raíz con providers
│   │   │   ├── page.tsx             # Página de inicio (pública)
│   │   │   ├── login/page.tsx       # Autenticación con Firebase
│   │   │   ├── register/page.tsx    # Registro de usuario
│   │   │   └── scanner/page.tsx     # Vista principal del scanner (protegida)
│   │   ├── api/
│   │   │   ├── scanner/route.ts     # GET /api/scanner — ejecuta el análisis
│   │   │   └── markets/route.ts     # GET /api/markets — devuelve los mercados disponibles
│   │   └── globals.css
│   │
│   ├── application/                 # Capa de aplicación (casos de uso + DTOs)
│   │   ├── dto/ScannerResult.ts     # Tipos de salida del scanner
│   │   └── usecases/runScanner.ts   # Caso de uso principal: orquesta providers y dominio
│   │
│   ├── domain/                      # Lógica de negocio pura (sin dependencias externas)
│   │   ├── entities/Stock.ts        # Entidad Stock del dominio
│   │   └── services/computeAth.ts   # Cálculo de ATH real y ATH 52 semanas
│   │
│   ├── infrastructure/              # Adaptadores externos
│   │   ├── cache/memoryCache.ts     # Caché en memoria para reducir llamadas a APIs
│   │   └── marketData/
│   │       ├── MarketDataProvider.ts    # Interfaz del proveedor (contrato)
│   │       ├── providerFactory.ts       # Fábrica: selecciona proveedor por source
│   │       ├── yahooProvider.ts         # Proveedor Yahoo Finance
│   │       ├── alphaVantageProvider.ts  # Proveedor Alpha Vantage
│   │       ├── stooqProvider.ts         # Proveedor Stooq
│   │       ├── mockProvider.ts          # Proveedor mock para desarrollo y tests
│   │       ├── errors.ts                # Errores tipados (ProviderRateLimitError, etc.)
│   │       └── mappings/                # Mapeo ticker local → símbolo del proveedor
│   │           ├── ibexMappings.ts
│   │           ├── daxMappings.ts
│   │           └── ftse_mibMappings.ts
│   │
│   ├── config/
│   │   └── markets/                 # Configuración estática de cada índice bursátil
│   │       ├── ibex35.ts            # 35 valores del IBEX 35
│   │       ├── dax40.ts             # 40 valores del DAX 40
│   │       ├── ftse_mib40.ts        # 40 valores del FTSE MIB 40
│   │       └── index.ts             # Registro central de mercados
│   │
│   ├── components/
│   │   ├── scanner/
│   │   │   ├── ScannerControls.tsx    # Controles: mercado, fuente de datos, modo ATH
│   │   │   ├── ScannerTable.tsx       # Tabla de resultados ordenable
│   │   │   ├── StockDetailsPanel.tsx  # Panel lateral con métricas y gráfico
│   │   │   └── TradingViewWidget.tsx  # Widget de gráficos de TradingView
│   │   ├── auth/
│   │   │   └── AuthCookieSyncClient.tsx  # Sincroniza token Firebase con cookie de sesión
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── LanguageSwitcher.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx          # Contexto global de autenticación (Firebase)
│   │
│   ├── hooks/
│   │   └── useAuthCookieSync.ts     # Hook: mantiene cookie sincronizada con Firebase
│   │
│   ├── lib/
│   │   ├── formatters.ts            # fmtMoney, fmtPct, fmtDateTimeFull, getDistanceStyle
│   │   ├── security.ts              # sanitizeSymbol — previene XSS en widget externo
│   │   ├── validation.ts            # Schemas Zod para validar inputs de la API
│   │   └── firebase/config.ts       # Inicialización del SDK de Firebase
│   │
│   ├── i18n/
│   │   ├── en.json                  # Mensajes en inglés
│   │   ├── es.json                  # Mensajes en español
│   │   ├── routing.ts               # Configuración de locales y prefijo de ruta
│   │   └── request.ts               # Resolución del locale en el servidor
│   │
│   └── middleware.ts                # Protección de rutas + middleware i18n
│
├── src/tests/
│   ├── unit/computeAth.test.ts
│   ├── components/ScannerTable.test.tsx
│   ├── components/StockDetailsPanel.test.tsx
│   ├── infrastructure/yahooProvider.test.ts
│   ├── integration/runScanner.test.ts
│   └── lib/formatters.test.ts · security.test.ts
│
├── docs/diagrams/system.mmd        # Diagrama Mermaid de arquitectura
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

### Principios arquitectónicos aplicados

| Principio | Aplicación concreta |
|---|---|
| Separación de capas (SoC) | `domain` no importa nada de `infrastructure` ni de `app` |
| Inversión de dependencias | `runScanner` depende de la interfaz `MarketDataProvider`, no de un proveedor concreto |
| Proveedor intercambiable | `providerFactory` permite cambiar la fuente de datos sin tocar el caso de uso |
| Validación en frontera | Parámetros de la API validados con Zod antes de llegar al dominio |
| Seguridad defensiva | Símbolos saneados con regex antes de pasarlos al widget externo de TradingView |
| Defensa en profundidad | Seguridad en capas: validación Zod + `sanitizeSymbol` + cabeceras HTTP CSP/HSTS/X-Frame |
| Tolerancia a fallos | `runScanner` usa `Promise.all` con `try/catch` por valor; un error no interrumpe el resto |

---

## Funcionalidades principales

### 1. Scanner de ATH por índice bursátil

El usuario selecciona un mercado (IBEX 35, DAX 40 o FTSE MIB 40), una fuente de datos y un modo de cálculo. La aplicación consulta la API de datos históricos, calcula la distancia de cada valor a su ATH y presenta los resultados en una tabla ordenable con indicadores visuales de color.

**Endpoint:** `GET /api/scanner?market=ibex35&source=yahoo&mode=ath_real`

**Modos de cálculo:**
- `ath_real` — ATH absoluto histórico (ventana de 5 años)
- `ath_52w` — Máximo de las últimas 52 semanas (~252 sesiones)

**Indicadores de distancia:**
- Verde: el valor ha marcado un nuevo ATH hoy
- Amarillo: el valor está a menos del 3% del ATH
- Blanco: el valor está alejado del ATH

### 2. Panel de detalle de acción

Al seleccionar una fila de la tabla, se abre un panel lateral con:
- Máximo del día actual (`currentHigh`)
- ATH calculado
- Distancia al ATH en porcentaje con semántica de color
- Fecha y hora de la última actualización
- Gráfico interactivo de TradingView con el símbolo del valor

### 3. Autenticación con Firebase

- Registro e inicio de sesión mediante Firebase Auth.
- El token de Firebase se sincroniza automáticamente con una cookie `auth-session`.
- El middleware de Next.js protege la ruta `/scanner` y redirige a `/login` si no existe sesión válida, preservando la URL de destino como parámetro `?from=`.

### 4. Internacionalización (i18n)

- Dos idiomas soportados: **español** (por defecto) y **inglés**.
- Todas las rutas incluyen prefijo de locale: `/es/scanner`, `/en/scanner`.
- Cambio de idioma sin recarga de página mediante `next-intl`.

### 5. Múltiples proveedores de datos con caché

- Patrón **Factory** para seleccionar el proveedor en tiempo de ejecución.
- Caché en memoria para evitar llamadas redundantes a APIs externas.
- Errores de rate-limit devueltos al cliente como HTTP 429 con información del proveedor afectado.

### 6. Seguridad de inputs y cabeceras HTTP

- Parámetros de la API validados con **Zod** (`scannerQuerySchema`) antes de ejecutar cualquier lógica.
- Función `sanitizeSymbol` que filtra cualquier cadena que no coincida con el formato canónico `EXCHANGE:TICKER`, previniendo cualquier intento de inyección en el widget externo de TradingView.
- **Cabeceras HTTP de seguridad** aplicadas a todas las rutas vía `next.config.ts`:

| Cabecera | Valor | Propósito |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Evita MIME-type sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Protección anti-clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limita información enviada a terceros |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Deshabilita APIs del navegador no usadas |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Fuerza HTTPS durante 2 años |
| `Content-Security-Policy` | Ver `next.config.ts` | Restringe orígenes de scripts, iframes y conexiones |

La CSP está ajustada a los dominios exactos requeridos: `s3.tradingview.com` para el script del widget, `www.tradingview.com` para sus iframes, y `*.googleapis.com` / `*.firebaseio.com` para Firebase Auth.

---

## API — referencia rápida

### `GET /api/scanner`

| Parámetro | Obligatorio | Valores | Default |
|---|---|---|---|
| `market` | Sí | `ibex35`, `dax40`, `ftse_mib40` | — |
| `source` | No | `yahoo`, `alphavantage`, `stooq` | `yahoo` |
| `mode` | No | `ath_real`, `ath_52w` | `ath_52w` |

**Respuesta de ejemplo:**

```json
{
  "data": [
    {
      "ticker": "IBE",
      "name": "Iberdrola",
      "tradingViewSymbol": "BME:IBE",
      "ath": 13.45,
      "currentHigh": 13.62,
      "distancePct": 1.26,
      "isNewAth": true,
      "isNearAth": false,
      "lastUpdate": "2026-02-19T16:30:00.000Z"
    }
  ]
}
```

### `GET /api/markets`

Devuelve la lista de mercados disponibles con sus IDs y nombres.

---

## Testing

### Estrategia

La suite sigue una **pirámide de tres niveles**: funciones puras primero (mayor ROI, sin dependencias), componentes después, e integración al final con proveedores mock que nunca llaman a APIs reales en CI.

| Nivel | Fichero | Qué valida |
|---|---|---|
| Unitario — Dominio | `unit/computeAth.test.ts` | Cálculo de ATH real y ATH 52 semanas, casos límite y datos vacíos |
| Unitario — Seguridad | `lib/security.test.ts` | `sanitizeSymbol`: 4 grupos — símbolos válidos, inyecciones (XSS/SQL/null byte/path traversal), edge cases, límites de longitud |
| Unitario — Formatters | `lib/formatters.test.ts` | `fmtMoney`, `fmtPct`, `fmtDateTimeFull`, `getDistanceStyle` con todos sus estados |
| Componente | `components/ScannerTable.test.tsx` | Renderizado, ordenación de columnas, estados vacío y cargando |
| Componente | `components/StockDetailsPanel.test.tsx` | Props completas, estado sin selección, botón de cierre |
| Infraestructura | `infrastructure/yahooProvider.test.ts` | Adaptador Yahoo Finance con mocks de red |
| Integración | `integration/runScanner.test.ts` | Caso de uso completo: proveedor mock → dominio → DTO de salida |

### Métricas

| Métrica | Valor |
|---|---|
| Total de tests | **111** |
| Suites | **7** |
| Tests fallando en CI | **0** |
| Cobertura — `lib/` | ~100% |
| Cobertura — `domain/` | ~100% |

### Decisiones de testing

- `sanitizeSymbol` cubre **4 grupos de casos** porque es la frontera de seguridad antes del widget externo de TradingView:
  - **Símbolos válidos** — formatos canónicos `EXCHANGE:TICKER`, índices `^IBEX`, tickers simples y con separadores (`.`, `-`)
  - **Inyecciones** — XSS (`<script>`), `javascript:`, event handlers, HTML entities, URL encoding
  - **Edge cases** — null bytes, newline injection, path traversal (`../`), SQL injection, espacios, lowercase
  - **Límites** — longitud máxima de exchange (12 chars) y ticker (20 chars); entradas `null`/`undefined` no lanzan excepción
- Los tests de infraestructura usan **mocks de red** — nunca consumen llamadas reales a APIs externas en CI.
- `computeAth` cubre el caso borde de array vacío o menor de 2 velas, que es el fallo silencioso más habitual en integraciones de datos de mercado.

### Ejecutar tests

```bash
# Todos los tests
npm test

# Modo watch (desarrollo)
npx vitest
```

---

## Variables de entorno — referencia completa

| Variable | Entorno | Descripción |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | cliente + servidor | Clave pública de Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | cliente + servidor | Dominio de autenticación |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | cliente + servidor | ID del proyecto Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | cliente + servidor | Bucket de Storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | cliente + servidor | Sender ID de FCM |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | cliente + servidor | App ID de Firebase |
| `ALPHA_VANTAGE_API_KEY` | solo servidor | Clave de Alpha Vantage |

---

## Licencia

Proyecto académico — TFM Máster Desarrollo con IA · 2026.
