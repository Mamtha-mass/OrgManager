# OrgManager Pro

A vibrant, modern, and beautiful dashboard for managing multi-tenant organizations. This project features a high-performance React frontend with stunning 3D parallax effects, glassmorphism design, and interactive data visualization.

## 🚀 Features

*   **Immersive UI:** 3D floating background elements that respond to mouse movement and scrolling using Framer Motion.
*   **Dashboard Overview:** Real-time metrics, rich statistics cards with sparklines, and traffic visualization using Recharts.
*   **Organization Management:** Complete CRUD (Create, Read, Update, Delete) functionality for tenant management.
*   **Persistence:** Uses `localStorage` to simulate a real backend, persisting data across page reloads.
*   **Authentication:** Mock login flow with secure session handling.
*   **Responsive Design:** Fully optimized for desktop and mobile viewports using Tailwind CSS.
*   **Interactive Components:** Custom-built 3D tilt cards, animated modals, and interactive buttons.

## 🛠️ Tech Stack

*   **Framework:** React 18
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Routing:** React Router DOM

## 🔑 Default Credentials

To access the dashboard, use the following mock credentials:

*   **Email:** `admin@example.com`
*   **Password:** `password`

## 📂 Project Structure

```text
├── index.html          # Entry point with Import Maps & Tailwind CDN
├── index.tsx           # React Application Entry
├── App.tsx             # Main Router & Auth State Management
├── types.ts            # TypeScript interfaces
├── services/
│   └── mockApi.ts      # Simulated Backend API with LocalStorage
├── components/
│   └── ui.tsx          # Reusable UI library (Buttons, Inputs, 3D Cards, Modals)
└── pages/
    ├── Login.tsx       # Animated Login Page
    └── Dashboard.tsx   # Main Dashboard, Stats, and CRUD Logic
```

## 🏃‍♂️ How to Run

This project is designed to run directly in the browser using ES Modules (via `esm.sh`) and Tailwind CSS via CDN.

1.  **Serve:** Use any static file server (e.g., VS Code Live Server, `npx http-server`, or `python3 -m http.server`).
2.  **Open:** Navigate to `localhost` in your browser.
3.  **Log in:** Use the credentials provided above.

## 🎨 Design Philosophy

The interface utilizes a "Glassmorphism" aesthetic combined with deep, rich gradients and 3D positioning. The `Dashboard.tsx` leverages complex animation hooks (`useScroll`, `useTransform`, `useSpring`) to create a sense of depth that reacts to user interaction.
