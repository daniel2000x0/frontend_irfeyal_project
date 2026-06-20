# Asistencia — Módulo de Gestión de Asistencia Educativa

Este repositorio contiene el **módulo de asistencia** del sistema educativo **IRFEYAL**, extraído y adaptado con **fines de portafolio**. El código completo del sistema IRFEYAL es privado y pertenece a sus respectivos dueños.

---

## Lo que demuestra este módulo

### Angular Moderno (17+)
- **Standalone components** — sin NgModules, imports explícitos
- **Signals** para estado reactivo (`signal()`, `computed` internamente en `FiltroState`)
- **Control Flow** (`@if`, `@for`) en templates (built-in control flow de Angular 17)
- **FormControl reactivo** para fechas
- **takeUntil + OnDestroy** para prevenir memory leaks

### RxJS Avanzado
- **forkJoin** para paralelizar N requests HTTP (`guardarAsistencias()`)
- **switchMap-ready** (patrón de filtros en cascada permite migración directa)
- **takeUntil** para cancelación controlada
- **retry(1)** en todos los endpoints del servicio (tolerancia a fallos transientes)

### Arquitectura Limpia
- **DTOs tipados** (`CrearClaseDto`, `CrearAsistenciaDto`, `DestType`, `FiltroState`)
- **Servicio de reportes** (`ReporteService`) separado de la lógica de componente
- **LoadingService + HttpInterceptor** funcional para tracking global de peticiones
- **FullNamePipe** standalone reutilizable
- **FiltroState** class que encapsula el estado y la lógica de filtros en cascada

### TypeScript
- Interfaces fuertemente tipadas para modelos, DTOs y servicios
- Getters (`empleadoId`, `isAdmin`)
- Union types (`DestType = 'crear' | 'actu'`)

### PrimeNG
- **p-table** con paginación, ordenamiento, filtrado global y striped rows
- **p-select** con templates personalizados
- **p-dialog**, **p-datepicker**, **p-toast**, **p-toolbar**
- PrimeNG 17 con configuración funcional

### Pruebas Unitarias
- Jasmine specs para ambos componentes
- Pruebas de estado inicial, handlers de filtros, validación de rangos de fecha
- Configuración Karma + ChromeHeadless

### DevOps
- **Dockerfile multi-stage** (node:20-alpine → nginx:alpine)
- Build production optimizado con Angular CLI

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 17 |
| UI Kit | PrimeNG 17 |
| Lenguaje | TypeScript |
| Reactive | RxJS 7 |
| Testing | Karma + Jasmine |
| Contenedor | Docker |

## Inicio Rápido

```bash
npm install
ng serve
```

## Build

```bash
npm run build
```

## Docker

```bash
docker build -t asistencia-portfolio .
docker run -p 80:80 asistencia-portfolio
```
