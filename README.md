# Notes App

Cohort 9 — MERN (Node.js + React.js) assignment for Umme Rubab.

A full-stack Notes application built using the MERN stack. The application provides user authentication and allows authenticated users to manage their personal notes.

## Features

### Authentication

* User registration and login
* Password hashing with bcryptjs
* JWT-based authentication
* Protected routes
* Authentication state management

### Notes

* Create notes
* View notes
* Edit notes
* Delete notes
* Pin and unpin notes
* Search notes
* Rich-text editing with React Quill
* User-specific notes

### Testing and Code Quality

* Frontend tests using Jest and React Testing Library
* Backend tests using Mocha and Chai
* LCOV test coverage
* SonarQube code quality analysis
* Centralized backend error handling
* Pino logging

## Technologies

### Frontend

* React.js
* React Router DOM
* Axios
* React Quill
* Jest
* React Testing Library

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Pino
* Mocha
* Chai

### Tools

* Git
* GitHub
* Docker
* SonarQube Community Build

## Project Structure

```text
cohort-9-mern-14252-umme/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Signup.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── noteController.js
│   │   ├── models/
│   │   │   ├── Note.js
│   │   │   ├── User.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── noteRoutes.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── noteService.js
│   │   └── utils/
│   │       ├── ApiError.js
│   │       └── asyncHandler.js
│   ├── test/
│   │   ├── auth.test.js
│   │   └── note.test.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── sonar-project.properties
└── README.md
```

## Client Files

### `client/src/App.js`

Defines the main React application and its routes.

### `client/src/App.css`

Contains the application's styling.

### `client/src/index.js`

The entry point of the React application.

### `client/src/components/Login.jsx`

Provides the login form and handles user login.

### `client/src/components/Signup.jsx`

Provides the registration form and handles new user registration.

### `client/src/components/Navbar.jsx`

Provides navigation and authentication-related actions.

### `client/src/components/PrivateRoute.jsx`

Protects routes that require an authenticated user.

### `client/src/context/AuthContext.js`

Manages authentication state across the React application.

### `client/src/services/api.js`

Handles communication between the React frontend and backend API.

## Server Files

### `server/src/controllers/authController.js`

Handles HTTP requests related to authentication.

### `server/src/controllers/noteController.js`

Handles HTTP requests related to note management.

### `server/src/models/User.js`

Defines the Mongoose user schema and model.

### `server/src/models/Note.js`

Defines the Mongoose note schema and model.

### `server/src/models/index.js`

Provides access to the application's database models.

### `server/src/routes/authRoutes.js`

Defines authentication API routes.

### `server/src/routes/noteRoutes.js`

Defines note management API routes.

### `server/src/routes/index.js`

Organizes and mounts the application's API routes.

### `server/src/services/authService.js`

Contains authentication business logic such as registration and login.

### `server/src/services/noteService.js`

Contains business logic for note operations.

### `server/src/utils/ApiError.js`

Provides a custom error structure for API errors.

### `server/src/utils/asyncHandler.js`

Provides reusable handling for asynchronous Express route errors.

## Testing

### Frontend

Frontend tests use Jest and React Testing Library.

From the `client` directory:

```bash
npm test
```

To run tests without watch mode:

```bash
npm test -- --watchAll=false
```

### Backend

Backend tests use Mocha and Chai.

From the `server` directory:

```bash
npm test
```

## Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/notes_app
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Do not commit the actual `.env` file or sensitive credentials.

## Installation

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd cohort-9-mern-14252-umme
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

Configure the backend `.env` file before starting the application.

## Running the Application

### Backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

From the `client` directory:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

Make sure MongoDB is running before using database-related features.

## SonarQube

SonarQube Community Build was used for static code quality analysis.

The project configuration is stored in:

```text
sonar-project.properties
```

The configuration includes the project key, project name, source directories, exclusions, SonarQube server URL, and frontend LCOV coverage report.

Latest local analysis:

* **Quality Gate:** Passed
* **Security:** A
* **Reliability:** C
* **Maintainability:** A
* **Coverage:** 12.2%
* **Duplications:** 0.0%
* **Security Hotspots:** 0

SonarQube was run locally using Docker.

## Project Goals

This project was developed to practice:

* MERN stack development
* REST API development
* Authentication and authorization
* MongoDB and Mongoose
* Layered backend architecture
* Error handling
* Automated testing
* Code coverage
* SonarQube analysis
* Git and GitHub workflow

## Author

**Umme Rubab**

Cohort 9 — MERN (Node.js + React.js) Assignment
