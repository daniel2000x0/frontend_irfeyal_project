# Asistencia — Sistema de Gestión de Asistencia (Portfolio)

Módulo de asistencia estudiantil extraído y modernizado del sistema **IRFEYAL** (software integral de gestión educativa). Desarrollado con Angular 21 standalone components.

## Stack Técnico

| Tecnología | Versión |
|-----------|---------|
| Angular | 21 (standalone) |
| PrimeNG | 21 |
| PrimeFlex | 4 |
| PrimeIcons | 7 |
| SweetAlert2 | 11 |
| TypeScript | 5.9 |
| Karma + Jasmine | 6.x (tests) |
| Puppeteer | 24 (headless CI) |

## Contexto del Proyecto Original

**IRFEYAL** es un sistema web full-stack para gestión educativa con 60+ módulos (matrículas, pagos, inventarios, parametrización académica, tutorías, secretaría, roles, etc.). Este repositorio contiene **solo el módulo de Asistencia** que desarrollé, extraído como proyecto independiente para portafolio. El backend corre en `http://localhost:9070/` (Spring Boot).

---

## Estructura del Proyecto

```
src/
  app/
    dto/                               # Data Transfer Objects
      filtro-state.ts                  # Estado de filtros en cascada (class)
      asistencia.dto.ts                # DTOs para crear clase/asistencia (interfaces)
      index.ts                         # Barrel exports
    models/                            # Interfaces del dominio (API contracts)
      asistencia.ts                    # Asistencia, Clase
      catalogo.ts                      # Periodo, Modalidad, Curso, Paralelo, Asignatura, FechaAsistencia
      estudiante.ts                    # Estudiante, Persona
      usuario.ts                       # Usuario
    services/                          # Capa HTTP y autenticación
      asistencia.service.ts            # CRUD + reportes PDF
      auth.service.ts                  # Usuario autenticado (stub con signal)
    pages/                             # Componentes standalone
      listar-asistencia/               # Listado, info de faltas, reportes PDF
      registrar-asistencia/            # Registro y actualización de asistencia
    app.ts                             # Root component con header + router-outlet
    app.config.ts                      # Providers: router, HTTP, animaciones, PrimeNG
    app.routes.ts                      # Rutas: /asistencia/listar, /asistencia/registrar
    app.html                           # Layout: header nav + main outlet
    app.scss                           # Variables CSS, layout, overrides PrimeNG
  environments/
    environment.ts                     # apiUrl: http://localhost:9070/
    environment.prod.ts                # apiUrl: /api/
  styles.scss                          # Imports: PrimeFlex, PrimeIcons
karma.conf.js                          # Test runner: Jasmine + ChromeHeadless
```

---

## Arquitectura

### Flujo de Datos

```
Template (HTML)  ──(evento)──>  Component (TS)  ──(llamada)──>  Service
                                      │                              │
                                      │                              ▼
                                      │                         HttpClient
                                      │                              │
                                      ▼                              ▼
                              FiltroState                      Backend REST
                              (DTO class)                     (Spring Boot)
```

### Filtros en Cascada

Ambos componentes implementan un patrón de filtros encadenados donde la selección de un nivel habilita el siguiente:

```
Periodo → Modalidad → Curso → Paralelo → Asignatura
```

Cada selección carga dinámicamente las opciones del siguiente nivel vía API. Los `show*` flags controlan `[disabled]` en los selects.

### Subscription Management

Todos los suscripciones HTTP usan `takeUntil(this.destroy$)` con un `Subject<void>` completado en `ngOnDestroy()` para evitar memory leaks.

---

## Especificación de Componentes

### App (`app.ts`)

- **Rol**: Layout principal con header sticky y `router-outlet`
- **Nav**: Enlaces a `/asistencia/listar` y `/asistencia/registrar` con `routerLinkActive`
- **Header**: Gradient azul con brand, navegación y usuario logueado
- **Estilos**: Variables CSS custom (`--primary`, `--bg`, etc.), layout flexbox, overrides de diálogos PrimeNG

### ListarAsistenciaComponent

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `loading` | `signal<boolean>` | Estado de carga inicial |
| `loadingEstudiante` | `signal<boolean>` | Estado de carga del diálogo de info |
| `periodos, modalidades, cursos, paralelos, asignaturas` | `*[]` | Catálogos para filtros |
| `idPeriodo, idModalidad, idCurso, idParalelo, idAsignatura` | `number` | IDs seleccionados |
| `showModalidad, showCurso, showParalelo, showAsignatura` | `boolean` | Control disabled de selects |
| `estudiantes` | `Estudiante[]` | Resultado de filtros |
| `estudianteInfo` | `Estudiante[]` | Info del estudiante en diálogo |
| `fechasFaltas` | `FechaAsistencia[]` | Historial de faltas |
| `showDialog` | `boolean` | Visibilidad del diálogo de info |
| `filterValue` | `string` | Filtro global de la tabla |
| `botonReportes` | `boolean` | Muestra sección de reportes |
| `fechaInicio, fechaFin, fechaInicioIndi, fechaFinIndi` | `FormControl` | Control de fechas |
| `validarRangoCurso, validarRangoIndi` | `boolean` | Validez de rangos de fechas |

**Métodos públicos:**

| Método | Descripción |
|--------|-------------|
| `onPeriodo(id)` | Selecciona periodo, resetea todo, carga modalidades |
| `onModalidad(id)` | Selecciona modalidad, carga cursos |
| `onCurso(event)` | Procesa evento del select (objeto o id), carga paralelos |
| `onParalelo(id)` | Selecciona paralelo, carga asignaturas |
| `onAsignatura(id)` | Selecciona asignatura, carga estudiantes via API |
| `mostrarInfo(id)` | Abre diálogo con info del estudiante y sus faltas |
| `reporteCurso()` | Genera PDF de reporte por curso |
| `reporteIndividual()` | Genera PDF de reporte individual |

### RegistrarAsistenciaComponent

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `loading` | `signal<boolean>` | Estado de carga |
| `showDiv` | `boolean` | Muestra input de fecha cuando filtros activos |
| `periodos, modalidades, cursos, paralelos, asignaturas` | `*[]` | Catálogos (crear) |
| `filtros` | `FiltroState` | Estado de filtros de creación |
| `filtrosActu` | `FiltroState` | Estado de filtros de actualización |
| `estudiantes` | `Estudiante[]` | Alumnos a registrar asistencia |
| `estudiantesFaltas` | `number[]` | IDs de estudiantes marcados como falta |
| `claseActual` | `Clase` | Clase a crear |
| `actualizarDialog` | `boolean` | Visibilidad del diálogo de actualización |
| `asistenciaActualizar` | `Asistencia[]` | Registros a modificar |
| `fechaControl, fechaControlActu` | `FormControl` | Control de fechas |
| `validaFecha, validaFechaAct` | `number` | Estado de validación de fecha |

**Métodos públicos:**

| Método | Descripción |
|--------|-------------|
| `onPeriodo(dest, id)` | Selecciona periodo para crear o actualizar |
| `onModalidad(dest, id)` | Selecciona modalidad |
| `onCurso(dest, id)` | Selecciona curso |
| `onParalelo(dest, id)` | Selecciona paralelo |
| `onAsignatura(dest, id)` | Selecciona asignatura, carga estudiantes |
| `onCheckFalta(value, checked)` | Marca/desmarca falta |
| `onValidarFecha()` | Valida que la fecha sea la actual |
| `submit()` | Crea clase + asistencias |
| `actualizar()` | Abre diálogo de actualización |
| `buscarActualizar()` | Busca asistencias a actualizar |
| `validaFechaActualizar()` | Valida fecha del diálogo |
| `cambioFalta(value, checked)` | Actualiza falta en el diálogo |

---

## DTOs (`src/app/dto/`)

### FiltroState (clase con estado y comportamiento)

```typescript
class FiltroState {
  idPeriodo: number          // 0 = no seleccionado
  idModalidad: number
  idCurso: number
  idParalelo: number
  idAsignatura: number
  showModalidad: boolean     // true = disabled
  showCurso: boolean
  showParalelo: boolean
  showAsignatura: boolean

  limpiarCursos()            // Resetea curso, paralelo, asignatura + show flags
  seleccionarPeriodo(id)     // Actualiza estado al seleccionar periodo
  seleccionarModalidad(id)
  seleccionarCurso(id)
  seleccionarParalelo(id)
  seleccionarAsignatura(id)
  filtrosActivos(): boolean  // true si todos los IDs > 0
}
```

### CrearClaseDto

```typescript
interface CrearClaseDto {
  idClase: number;           // 0 para nueva
  fecClase: string;          // "yyyy-MM-ddTHH:mm:ss.SSSZ"
  id_periodo: number;
  id_modalidad: number;
  idDocente: number;
  idAsignatura: number;
  idParalelo: number;
  idCurso: number;
}
```

### CrearAsistenciaDto

```typescript
interface CrearAsistenciaDto {
  idAsistencia: number;      // 0 para nueva
  estadoAsis: boolean;       // true = falta
  idClase: number;
  idEstudiante: number;
}
```

---

## Modelos de Dominio (`src/app/models/`)

### Asistencia y Clase

```typescript
interface Asistencia {
  idAsistencia: number;
  estadoAsis: boolean;       // true = falta
  idClase: number;
  idEstudiante: number;
}

interface Clase {
  idClase: number;
  fecClase: string;
  id_modalidad: number;
  id_periodo: number;
  idDocente: number;
  idAsignatura: number;
  idParalelo: number;
  idCurso: number;
}
```

### Catálogos

```typescript
interface Periodo {
  id_periodo: number;
  malla: { descripcion: string };
  fecha_inicio: string;
  fecha_fin: string;
}

interface Modalidad { id_modalidad: number; descripcion: string; }
interface Curso { id_curso: number; descripcion: string; }
interface Paralelo { id_paralelo: number; descripcion: string; }
interface Asignatura { id_asignatura: number; descripcion: string; }
interface FechaAsistencia { idAsignatura: { descripcion: string }; fecClase: string; }
```

### Usuario y Persona

```typescript
interface Usuario {
  id_usuario: number;
  empleado?: { id_empleado: number };
  roles: string[];
}

interface Estudiante {
  id_estudiante: number;
  id_persona: Persona;
}

interface Persona {
  id_persona: number;
  nombre: string;
  apellido: string;
  cedula: string;
}
```

---

## Servicios

### AsistenciaService (`src/app/services/asistencia.service.ts`)

Base URL: `{apiUrl}asistencia/` (configurable por entorno)

| Método | HTTP | Endpoint | Respuesta |
|--------|------|----------|-----------|
| `getAllPeriodo()` | GET | `/Periodo` | `Periodo[]` |
| `getAllModalidad()` | GET | `/Modalidad` | `Modalidad[]` |
| `getAllCurso()` | GET | `/Curso` | `Curso[]` |
| `getAllParalelo()` | GET | `/Paralelo` | `Paralelo[]` |
| `getAllAsignatura()` | GET | `/asignaturas` | `Asignatura[]` |
| `listarPeriodos(emp)` | GET | `/Periodos/{emp}` | `Periodo[]` |
| `listarModalidad(emp, per)` | GET | `/modalidades/{emp}/{per}` | `Modalidad[]` |
| `listarCursos(emp, per, mod)` | GET | `/cursos/{emp}/{per}/{mod}` | `Curso[]` |
| `listarParalelo(emp, per, mod, cur)` | GET | `/paralelos/{emp}/{per}/{mod}/{cur}` | `Paralelo[]` |
| `listarAsignatura(emp, per, mod, cur, par)` | GET | `/asignaturas/{emp}/{per}/{mod}/{cur}/{par}` | `Asignatura[]` |
| `getFiltros(mod, per, par, asi, cur)` | GET | `/filtrosdelaasistencia/{mod}/{per}/{par}/{asi}/{cur}` | `Estudiante[]` |
| `getInfoEstudiante(id)` | GET | `/buscarestudianteid/{id}` | `Estudiante[]` |
| `getFechasFaltas(est, doc, asi, cur, par, mod, per)` | GET | `/mostrarfechasdefaltas/{est}/{doc}/{asi}/{cur}/{par}/{mod}/{per}` | `FechaAsistencia[]` |
| `createClase(dto)` | POST | `/clasesave` | `Clase` |
| `actualizarClases(clase)` | PUT | `/claseactualizar/{id}` | `Clase` |
| `buscarClase()` | GET | `/claseingresada` | `Clase` |
| `validarClase(doc, per, mod, cur, par, asi, fecha)` | GET | `/validarclass/{doc}/{per}/{mod}/{cur}/{par}/{asi}/{fecha}` | `number` |
| `validarClaseObj(mod, per, par, asi, cur, fecha, doc)` | GET | `/validarclase/{mod}/{per}/{par}/{asi}/{cur}/{fecha}/{doc}` | `Asistencia[]` |
| `create(dto)` | POST | `/asistenciasave` | `Asistencia` |
| `updateAsistencia(dto)` | PUT | `/updateasistencia/{id}` | `Asistencia` |
| `getFiltrosActualizar(mod, per, par, asi, cur, fecha, doc)` | GET | `/buscaractualizar/{mod}/{per}/{par}/{asi}/{cur}/{fecha}/{doc}` | `Asistencia[]` |
| `exportInvoice(est, doc, asi, user, inicio, fin)` | GET | `/exportInvoice/{...}` | `ArrayBuffer` (PDF) |
| `exportInvoiceCurso(mod, per, par, asi, cur, doc, user, inicio, fin)` | GET | `/exportInvoicecurso/{...}` | `ArrayBuffer` (PDF) |

### AuthService (`src/app/services/auth.service.ts`)

Stub de autenticación con un usuario administrador hardcodeado:

```typescript
readonly usuario = signal<Usuario>({
  id_usuario: 1,
  empleado: { id_empleado: 1 },
  roles: ['ROLE_Administrador'],
});
```

---

## Rutas

| Ruta | Componente |
|------|-----------|
| `/` | Redirige a `/asistencia/listar` |
| `/asistencia/listar` | ListarAsistenciaComponent |
| `/asistencia/registrar` | RegistrarAsistenciaComponent |
| `/**` | Redirige a `/asistencia/listar` |

---

## Pruebas

**Framework**: Jasmine 6 + Karma 6 + ChromeHeadless (Puppeteer)

**Comando**:
```bash
$env:CHROME_BIN = "$env:USERPROFILE\.cache\puppeteer\chrome\win64-148.0.7778.97\chrome-win64\chrome.exe"
ng test --no-watch --browsers=ChromeHeadless
```

**Cobertura**: 77 tests (6 suites)

| Suite | Tests | Descripción |
|-------|-------|-------------|
| `models/asistencia.spec.ts` | 2 | Creación de Asistencia y Clase |
| `models/catalogo.spec.ts` | 6 | Creación de Periodo, Modalidad, Curso, Paralelo, Asignatura, FechaAsistencia |
| `models/estudiante.spec.ts` | 1 | Creación de Estudiante con Persona |
| `services/auth.service.spec.ts` | 3 | Usuario admin por defecto |
| `services/asistencia.service.spec.ts` | 21 | Métodos HTTP (GET, POST, PUT) |
| `pages/listar-asistencia/*.spec.ts` | 16 | Estado inicial, filtros, info estudiante, reportes |
| `pages/registrar-asistencia/*.spec.ts` | 28 | Filtros, check faltas, validación fecha, limpieza |

### Patrones de Test

- **Servicios**: Uso de `HttpTestingController` para simular requests/responses
- **Componentes**: `TestBed.configureTestingModule` con `HttpClientTestingModule` + `BrowserAnimationsModule`
- **Métodos privados**: Acceso via bracket notation: `component['metodoPrivado']()`
- **Propiedades**: Acceso directo a `component.filtros.showModalidad` en el registrador

---

## Configuración del Entorno

### environment.ts (desarrollo)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9070/',
};
```

### environment.prod.ts (producción)

```typescript
export const environment = {
  production: true,
  apiUrl: '/api/',
};
```

El `apiUrl` se consume en `AsistenciaService` como base para todas las peticiones HTTP.

---

## Estilos

### Variables CSS (`app.scss`)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--primary` | `#3b82f6` | Color primario (botones, header) |
| `--primary-dark` | `#2563eb` | Header gradient |
| `--bg` | `#f1f5f9` | Fondo de página |
| `--surface` | `#ffffff` | Fondos de tarjetas |
| `--text` | `#0f172a` | Texto principal |
| `--border` | `#e2e8f0` | Bordes |

### Layout

- **Header**: Sticky, 60px, gradient azul con sombra
- **Main**: Flex 1, fondo `--bg`
- **Page card**: 12px border-radius, sombra suave, padding 1.5rem, `overflow: hidden`
- **Responsive**: PrimeFlex grid (`col-12 md:col-4`), inputs `w-full sm:w-auto`, flex-wrap en contenedores

### PrimeNG Overrides

- `p-datatable-striped`: Filas pares con `#f8fafc`
- `p-dialog-header`: Gradient primario con texto blanco
- `p-dropdown, p-calendar, p-inputtext`: Width 100%

---

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4200)
ng serve

# Compilar para producción (salida en dist/)
ng build

# Ejecutar pruebas
$env:CHROME_BIN = "$env:USERPROFILE\.cache\puppeteer\chrome\win64-148.0.7778.97\chrome-win64\chrome.exe"
ng test --no-watch --browsers=ChromeHeadless

# Build sin warnings de sweetalert2 en angular.json agregar:
# "allowedCommonJsDependencies": ["sweetalert2"]
```

---

## Notas Técnicas

- **sweetalert2** genera un warning de CommonJS en el build. Funcionalmente es correcto; se puede silenciar agregándolo a `allowedCommonJsDependencies` en `angular.json`.
- **Auth** es un stub. No hay login real. El usuario es siempre administrador con `id_empleado=1`.
- **Reportes PDF**: Los endpoints `exportInvoice*` retornan `ArrayBuffer` que se abre como blob en nueva ventana.
- **Cascading selects**: El patrón se implementa con flags `show*` y métodos `on*` que cargan datos via API. En el registrador se unificaron crear/actualizar usando el parámetro `dest: 'crear' | 'actu'`.
