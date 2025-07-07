# 🔐 Microservices Frontend Application with Angular and JWT

This project is a modern frontend web application built with Angular, leveraging the powerful PrimeNG library for a rich and responsive user interface. It features a modular architecture with components for user authentication (login and registration), task management, and a custom 404 error page, designed to provide a seamless and secure user experience. The application integrates with a microservices backend, utilizing best practices for state management, routing, and UI/UX design.

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) 
v20.19.3

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
example: ng generate component pages/auth/login
```

# Create project
ng new <project-name>

# Install components UI
npm install primeng @primeng/themes

npm install primeicons

npm install primeflex. (para utilidades css)

# Install components in the WSL
ng generate component shared/components/header

frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── auth.interceptor.ts
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── task.model.ts
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   ├── login.component.css
│   │   │   │   ├── register/
│   │   │   │   │   ├── register.component.ts
│   │   │   │   │   ├── register.component.html
│   │   │   │   │   ├── register.component.css
│   │   │   │   ├── auth.routes.ts
│   │   │   ├── tasks/
│   │   │   │   ├── task-list/
│   │   │   │   │   ├── task-list.component.ts
│   │   │   │   │   ├── task-list.component.html
│   │   │   │   │   ├── task-list.component.css
│   │   │   │   ├── task-create/
│   │   │   │   │   ├── task-create.component.ts
│   │   │   │   │   ├── task-create.component.html
│   │   │   │   │   ├── task-create.component.css
│   │   │   │   ├── tasks.service.ts
│   │   │   │   ├── tasks.routes.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   │   ├── header.component.ts
│   │   │   │   │   ├── header.component.html
│   │   │   │   │   ├── header.component.css
│   │   │   ├── shared.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.routes.ts
│   ├── assets/
│   ├── styles.css
│   ├── main.ts
│   ├── index.html
├── angular.json
├── package.json
├── tsconfig.json

## Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/nombre_proyecto.git
   cd nombre_proyecto
