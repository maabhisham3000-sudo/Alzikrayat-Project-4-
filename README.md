# Alzikrayat — Project 4 (Track A: JWT-Based Authentication)

## Selected Track and Rationale
This project implements **Track A: JWT-Based Authentication** on top of the Project 3 MERN foundation[cite: 6, 7]. The rationale for choosing Track A is to replace basic login with stateless token-based authentication using JSON Web Tokens (`jsonwebtoken`), protect all write operations (uploading/deleting photos and creating/editing/deleting comments) via `Authorization: Bearer <token>` middleware, and automatically attach tokens on the client side using an Axios interceptor without breaking existing functionality[cite: 7, 9].

## Description
Alzikrayat is a full-stack MERN photo-sharing web application for storing and sharing personal photos, memories, and comments[cite: 9]. Project 4 adds stateless JWT authentication and protected write endpoints while preserving user registration and login, responsive gallery browsing (grid/list view), public/private visibility controls, image uploads, photo detail views, profile management, and comments[cite: 7, 9].

## Technologies
MongoDB (MongoDB Atlas / Mongoose) | Express.js | React.js (Vite) | Node.js | JSON Web Token (`jsonwebtoken`) | `bcryptjs` | Axios (Interceptors) | React Router | Multer | Joi | HTML5 | CSS3 | JavaScript[cite: 7, 9]

## Setup Steps for JWT Authentication
1. **Backend JWT & Middleware:** Install `jsonwebtoken` in the backend (`npm install jsonwebtoken`), create `authMiddleware.js` to verify `Authorization: Bearer <token>`, issue signed JWTs in `authController.js` on register and login, attach `protect` to photo and comment write routes, and verify `req.user` ownership[cite: 7].
2. **Frontend Token Storage & Axios Interceptor:** Store the returned JWT in `AuthContext.jsx` (and `localStorage`), inject `Authorization: Bearer <token>` automatically via an Axios request interceptor, handle `401` responses cleanly, and clear the token on logout[cite: 7].

## Environment Variables
Create a `.env` file inside the `backend` folder (kept out of Git via `.gitignore`) with the following variables[cite: 7, 9]:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d
```

## How to Run the Full Stack
1. Clone the repository from GitHub (`https://github.com/maabhisham3000-sudo/Alzikrayat-Project-4-.git`) and navigate into the project directory (`cd Alzikrayat`)[cite: 12].
2. In a terminal inside the `backend` folder, run `npm install` followed by `npm install jsonwebtoken`, ensure the `uploads` directory exists, and configure `.env` with `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `JWT_EXPIRES_IN`[cite: 7, 9].
3. Start the backend server by running `node server.js` inside the `backend` folder and wait for the MongoDB connection and server startup confirmation on `http://localhost:5000`[cite: 9].
4. Open a second terminal in the `frontend` folder, run `npm install`, and start the development server with `npm run dev`[cite: 9].
5. Open the local URL printed in the terminal (typically `http://localhost:5173`) in your browser[cite: 9].

**Student Name:** ماب هشام عبدالعظيم  
**Department:** تقانة المعلومات[cite: 6]