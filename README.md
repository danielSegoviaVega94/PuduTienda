# 🦌 La Caja del Pudú

> Tienda online de frutas y verduras frescas del campo a tu mesa, con sistema de cajas personalizables y panel de administración completo.

---

## ¿Qué es este proyecto?

**La Caja del Pudú** es una tienda web para un negocio de venta de frutas y verduras frescas en La Serena y Coquimbo. Los clientes pueden elegir una caja base (Familiar, Gourmet, etc.), personalizar su contenido intercambiando productos y agregando extras, y finalizar el pedido directamente por WhatsApp.

El negocio se gestiona desde un **panel de administración** protegido por PIN que permite controlar productos, precios, plantillas de cajas, pedidos y configuración general — todo sin necesidad de servidor ni base de datos, usando `localStorage`.

---

## Stack tecnológico

| Herramienta | Versión | Uso |
|---|---|---|
| React | 19 | UI principal |
| TypeScript | 5.8 | Tipado estático |
| Vite | 6 | Build tool y dev server |
| Tailwind CSS | 4 | Estilos con directiva `@theme` |
| Motion | 12 | Animaciones (fork de Framer Motion) |
| Lucide React | 0.5 | Íconos |

**Sin backend.** Todo se persiste en `localStorage` del navegador.

---

## Comandos

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

```bash
npm install
```

### Desarrollo (con hot reload)

```bash
npm run dev
```

Abre el navegador en: **http://localhost:3000**

### Build de producción

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

### Vista previa del build

```bash
npm run preview
```

Sirve el build de producción localmente para verificar antes de desplegar.

### Verificar tipos TypeScript

```bash
npm run lint
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_WHATSAPP_NUMBER="56912345678"
```

Reemplaza el número con el WhatsApp del negocio (sin `+`, con código de país).

---

## Acceso al panel de administración

Navega a:

```
http://localhost:3000#/admin
```

**PIN por defecto:** `1234`

> Puedes cambiar el PIN desde **Ajustes → Cambiar PIN** dentro del panel.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── admin/                  # Panel de administración
│   │   ├── AdminLayout.tsx     # Shell del admin (sidebar + autenticación)
│   │   ├── AdminLogin.tsx      # Pantalla de ingreso por PIN
│   │   ├── AdminSidebar.tsx    # Navegación lateral
│   │   ├── AdminModal.tsx      # Modal reutilizable con animación
│   │   ├── AdminCard.tsx       # Tarjeta de estadística
│   │   ├── StatusBadge.tsx     # Badge de estado del pedido
│   │   ├── DashboardPage.tsx   # Resumen: pedidos, ingresos, top productos
│   │   ├── ProductsPage.tsx    # Listado y gestión de productos
│   │   ├── ProductForm.tsx     # Formulario crear/editar producto
│   │   ├── BoxesPage.tsx       # Listado y gestión de plantillas de caja
│   │   ├── BoxForm.tsx         # Formulario crear/editar plantilla de caja
│   │   ├── OrdersPage.tsx      # Listado de pedidos con filtros y paginación
│   │   ├── OrderDetail.tsx     # Detalle completo de un pedido
│   │   └── SettingsPage.tsx    # Configuración, PIN, export/import, reset
│   ├── Landing.tsx             # Página principal de la tienda
│   ├── Customizer.tsx          # Personalizador de caja (intercambios + extras)
│   └── BottomSheet.tsx         # Panel inferior del carrito
├── context/
│   └── AppContext.tsx          # Estado global compartido (tienda + admin)
├── hooks/
│   └── useHashRoute.ts         # Routing hash sin react-router (#/admin/...)
├── services/
│   └── storage.ts              # CRUD de localStorage + PIN + export/import
├── types.ts                    # Tipos TypeScript de toda la app
├── data.ts                     # Datos semilla (productos y cajas por defecto)
├── App.tsx                     # Raíz: decide entre Storefront y AdminLayout
└── main.tsx                    # Entry point con AppProvider
```

---

## Módulos principales

### Tienda (`Landing` + `Customizer`)

- **Landing**: Muestra el hero, las plantillas de cajas disponibles y el footer. La imagen del hero y el tagline son configurables desde el admin.
- **Customizer**: Permite al cliente elegir una caja, intercambiar productos de temporada por otros disponibles, agregar extras y ver el resumen de precios. Al confirmar, se guarda el pedido en `localStorage` y se abre WhatsApp con un resumen detallado.

### Panel de administración

| Sección | Ruta hash | Descripción |
|---|---|---|
| Dashboard | `#/admin` | Estadísticas del día, pedidos recientes, top 5 productos |
| Productos | `#/admin/productos` | CRUD completo, filtro por categoría, toggle de temporada |
| Cajas | `#/admin/cajas` | Plantillas de caja con sus productos y precios base |
| Pedidos | `#/admin/pedidos` | Historial de pedidos con filtros por estado |
| Ajustes | `#/admin/ajustes` | Nombre del negocio, WhatsApp, imagen hero, PIN, export/import |

### Persistencia (`storage.ts`)

- Los datos se cargan desde `localStorage` al iniciar la app.
- Si no existe data previa, se siembra desde `data.ts` (productos y cajas por defecto).
- El PIN se guarda como hash SHA-256; la sesión admin se guarda en `sessionStorage`.
- Soporta **exportar** todos los datos a JSON y **restaurar** desde un archivo JSON.

### Routing (`useHashRoute.ts`)

Routing basado en el hash de la URL sin dependencias externas:

```
http://localhost:3000           → Tienda
http://localhost:3000#/admin    → Dashboard admin
http://localhost:3000#/admin/productos → Productos admin
```

---

## Flujo de un pedido

1. Cliente elige una **plantilla de caja** en la tienda.
2. Intercambia productos de temporada (swaps) y agrega extras opcionales.
3. Confirma → el pedido se guarda en `localStorage` con estado `pendiente`.
4. Se abre **WhatsApp** con un mensaje pre-armado con el detalle del pedido.
5. El negocio gestiona el estado del pedido desde el **panel admin**.

---

## Despliegue

El proyecto genera archivos estáticos con `npm run build`. Compatible con cualquier hosting estático:

- **Vercel**: conecta el repositorio, build command `npm run build`, output `dist`.
- **Netlify**: igual que Vercel.
- **GitHub Pages**: usa la action de Vite para publicar la carpeta `dist`.

> Asegúrate de configurar la variable `VITE_WHATSAPP_NUMBER` en las variables de entorno del hosting.
