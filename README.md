# SanderCoin Frontend

Aplicación web para la gestión, compra, venta y transferencia de SanderCoin (SND), desarrollada con React, TypeScript y Vite.

## Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Principales Funcionalidades](#principales-funcionalidades)
- [Estilos y UI](#estilos-y-ui)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Características

- Registro y autenticación de usuarios.
- Compra, venta y transferencia de tokens SanderCoin.
- Consulta de balances y estadísticas en tiempo real.
- Panel de administración de cuenta.
- Interfaz moderna y responsiva.
- Animaciones y efectos visuales atractivos.

## Instalación

1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd FrontEnd
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```sh
   npm run dev
   ```

4. Accede a la aplicación en [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).

## Scripts Disponibles

- `npm run dev` – Inicia el servidor de desarrollo.
- `npm run build` – Compila la aplicación para producción.
- `npm run preview` – Previsualiza la build de producción.
- `npm run lint` – Ejecuta ESLint para analizar el código.

## Estructura del Proyecto

```
FrontEnd/
│
├── public/                  # Archivos públicos y estáticos
├── src/
│   ├── api/                 # Lógica de comunicación con el backend (API)
│   ├── assets/              # Imágenes y recursos gráficos
│   ├── interfaces/          # Definiciones de tipos y contratos TypeScript
│   ├── layouts/             # Componentes de layout (ej. MainLayout)
│   ├── pages/               # Vistas principales (Home, Login, Register, Payment, Sell, Transfer, AboutUs)
│   ├── styles/              # Archivos CSS
│   ├── App.tsx              # Componente raíz de la aplicación
│   └── main.tsx             # Punto de entrada de React
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Principales Funcionalidades

- **Home:** Estadísticas de blockchain, frases dinámicas y preguntas frecuentes.
- **Login/Register:** Autenticación de usuarios con validación y verificación por correo.
- **Payment:** Compra de tokens SND con balance actualizado y resumen de transacción.
- **Sell:** Venta de tokens SND, validación de balance y resumen de venta.
- **Transfer:** Transferencia de tokens entre usuarios, con validaciones y resumen.
- **AboutUs:** Información sobre la misión, visión, tecnología, equipo y valores de SanderCoin.
- **Navegación:** Menú responsivo con rutas protegidas para usuarios autenticados.

## Estilos y UI

- Estilos personalizados en `/src/styles/` para cada página y layout.
- Animaciones de partículas, gradientes y elementos visuales modernos.
- Responsive design para escritorio y dispositivos móviles.

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit: `git commit -m "Agrega nueva funcionalidad"`
4. Haz push a tu rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT.

---

Desarrollado por el equipo de SanderCoin.