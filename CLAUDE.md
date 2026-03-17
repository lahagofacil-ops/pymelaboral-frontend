# PymeLaboral Frontend

SPA React + Vite para PymeLaboral, SaaS de gestion laboral para PYMEs chilenas.

## Stack
- React 19 + Vite 8
- Tailwind CSS v4 (via @tailwindcss/vite)
- React Router DOM v7
- Lucide React (iconos)
- NO TypeScript — todo es JSX puro

## Comandos
```bash
npm run dev      # Dev server en http://localhost:5173
npm run build    # Build produccion en dist/
npm run preview  # Preview del build
```

## Variables de entorno
```
VITE_API_URL=http://localhost:3000   # URL del backend API
```

## Estructura
```
src/
├── context/AuthContext.jsx     # Auth con JWT (login, register, logout)
├── lib/
│   ├── api.js                 # Cliente HTTP con refresh token
│   ├── format.js              # Formateo CLP, RUT, fechas
│   ├── hooks.js               # useApi, useNotificationBadges
│   └── nav-config.js          # Navegacion por rol
├── components/
│   ├── ui/                    # Card, Button, Input, Select, Badge, Table, Dialog, etc.
│   ├── layout/                # DashboardLayout, Sidebar, Header, MobileNav
│   ├── dashboard/             # StatCard, AlertCard
│   └── chat/                  # ChatWidget (chat IA flotante)
└── pages/
    ├── auth/                  # Login, Registro
    ├── dashboard/             # Dashboard admin + worker
    ├── trabajadores/          # Lista, Nuevo, Detalle
    ├── contratos/             # Lista, Nuevo
    ├── liquidaciones/         # Lista, Nueva, Detalle
    ├── cotizaciones/          # Lista con generacion y pago
    ├── asistencia/            # Control con marcar entrada/salida
    ├── vacaciones/            # Solicitudes con aprobar/rechazar
    ├── finiquitos/            # Lista con simulador
    ├── ley-karin/             # Denuncias y protocolo
    ├── compliance/            # Score de cumplimiento
    ├── documentos/            # Gestion documental
    ├── configuracion/         # Empresa y usuarios
    └── planes/                # Planes y pricing
```

## Colores
- Primary: #1F4E79 (azul oscuro)
- Secondary: #0F6E56 (verde)

## Auth
- JWT con accessToken (15m) + refreshToken (7d)
- Tokens en localStorage
- Auto-refresh en api.js

## Roles
- SUPER_ADMIN, SUPERVISOR, OWNER, ADMIN, WORKER
- Sidebar filtra items por rol
- DashboardLayout redirige a /login si no hay sesion

## Convenciones
- Imports relativos (no @/ alias excepto en vite.config)
- API response: { success, data, error }
- Todos los textos en espanol
- formatCLP para montos, formatRut para RUTs
