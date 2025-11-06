# Mario Pinheiro - 30015420

Exercise: Developer Portfolio Site (Front-End) + Backend API

## Front-End

To run the development server:

```bash
npm start
```

To build for production:

```bash
npm run build
```

To serve the production build locally:

```bash
npx serve build
```

## WASM Components

The project includes Rust-based WebAssembly components for performance-critical visualizations (Game of Life and Collatz Conjecture).

### Prerequisites

- Rust (install from https://rustup.rs/)
- wasm-pack (`cargo install wasm-pack`)

### Building WASM

```bash
cd src/wasm
wasm-pack build --target web --out-dir ../pkg
```

This generates the WebAssembly files in `src/pkg/` that are imported by the React components.

## Back-End

The back-end is a Node.js/Express API providing authentication and dynamic project data.

### Setup

```bash
cd portfolio-backend
npm install
```

Create a `.env` file in the `portfolio-backend` directory with the following content:

```
JWT_SECRET=<your_unique_random_string_here>
PORT=5000
```

```bash
npm start  # or npm run dev for development with nodemon
```

Server runs on port 5000. An admin user is seeded on first start (username: admin, password: adminpass).

### API Endpoints

#### Authentication

- **POST /api/auth/register**  
  Register a new user. Default role: guest.  
  Body: `{ "username": "string", "password": "string", "role": "admin|guest" }`  
  Returns: `{ "message": "...", "token": "jwt" }`

- **POST /api/auth/login**  
  Login.  
  Body: `{ "username": "string", "password": "string" }`  
  Returns: `{ "token": "jwt" }`

#### Projects

- **GET /api/projects**  
  Public: Get all projects.  
  Returns: Array of project objects.

- **POST /api/projects**  
  Admin only: Add a new project.  
  Authorization: Bearer token with admin role.  
  Body: `{ "title": "string", "description": "string", "tech": ["string"] }`  
  Returns: Created project object.

#### Dashboard

- **GET /api/dashboard**  
  Protected: Personalized message for logged-in users.  
  Authorization: Bearer token.  
  Returns: `{ "message": "..." }`

### Testing

Use Postman or curl to test. Example curl for login:

```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"adminpass"}'
```
