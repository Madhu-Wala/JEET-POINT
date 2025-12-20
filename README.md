# JEET-Point — Quiz & Contest Platform

JEET-Point is a full‑stack web application for running quizzes and contests. Students can take adaptive quizzes; teachers can create/manage contests and questions; admins can manage users and system settings. The frontend is built with React + Vite and the backend is Node.js + Express with MongoDB and Firebase-based auth.

## Key Features

- Student
  - Register / sign in with Firebase auth
  - Browse and participate in quizzes/contests
  - View scores, attempt history and basic analytics
  - Adaptive/randomized question ordering (see [`shuffle`](backend/utils/shuffle.js))

- Teacher
  - Create, update, and delete quizzes and questions
  - Upload images/media via Cloudinary (see [`config/cloudinary.js`](backend/config/cloudinary.js) and [`middleware/upload.js`](backend/middleware/upload.js))
  - View student submissions and scores

## Tech Stack

- Frontend: React (Vite) — [frontend/jeet-point-app/package.json](frontend/jeet-point-app/package.json), [frontend/jeet-point-app/src](frontend/jeet-point-app/src)
- Backend: Node.js, Express — [backend/server.js](backend/server.js)
- Database: MongoDB — connection in [backend/config/db.js](backend/config/db.js)
- Authentication: Firebase — [backend/config/firebaseAdmin.js](backend/config/firebaseAdmin.js), [`middleware/firebaseAuth.js`](backend/middleware/firebaseAuth.js)
- File storage / media: Cloudinary — [backend/config/cloudinary.js](backend/config/cloudinary.js)
- Utilities: helper functions in [backend/utils/shuffle.js](backend/utils/shuffle.js)
- Tools: dotenv, nodemon (dev)

## Project Structure (brief)

- backend/
  - server.js — main Express server ([backend/server.js](backend/server.js))
  - config/ — DB, Firebase, Cloudinary configs ([backend/config/db.js](backend/config/db.js), [backend/config/firebaseAdmin.js](backend/config/firebaseAdmin.js), [backend/config/cloudinary.js](backend/config/cloudinary.js))
  - controllers/ — API logic ([`studentController`](backend/controllers/studentController.js), [`teacherController`](backend/controllers/teacherController.js))
  - routes/ — API routes ([backend/routes/studentRoutes.js](backend/routes/studentRoutes.js), [backend/routes/teacherRoutes.js](backend/routes/teacherRoutes.js))
  - middleware/ — auth & upload hooks ([backend/middleware/firebaseAuth.js](backend/middleware/firebaseAuth.js), [backend/middleware/upload.js](backend/middleware/upload.js))
  - utils/ — helpers ([backend/utils/shuffle.js](backend/utils/shuffle.js))
  - serviceAccountKey.json — Firebase service account 
    Get Firebase serviceAccountKey.json (concise steps)
    - Open https://console.firebase.google.com and select your project.
    - Click the gear icon → Project settings.
    - Open the "Service accounts" tab.
    - Click "Generate new private key" → Confirm. A JSON file will download.

- frontend/jeet-point-app/
  - src/
  - public/
  - package.json
  - README.md

## Installation & Local Setup

Prerequisites:
- Node.js (>=16+)
- npm or yarn
- MongoDB instance (local or cloud)
- Firebase project with service account (download JSON into `backend/serviceAccountKey.json`)
- Cloudinary account (for media uploads)

1. Clone repository
   ```sh
   git clone  https://github.com/Madhu-Wala/JEET-POINT.git
   cd JEET-POINT
   ```

2. Backend setup
   ```sh
   cd backend
   npm install
   ```
   - Create `.env` (example below).
   - Place Firebase service account at `backend/serviceAccountKey.json`.

3. Frontend setup
   ```sh
   cd frontend/jeet-point-app
   npm install
   ```

4. Run services
   - Start backend:
     ```sh
     cd backend
     nodemon server.js
     ```
     (See [backend/server.js](backend/server.js) for default port.)
   - Start frontend:
     ```sh
     cd frontend/jeet-point-app
     npm run dev
     ```
     - Open frontend: http://localhost:5173 (Vite default)
     - Backend default: http://localhost:3000 (see backend/server.js)

## Environment Variables (.env example)

Create `backend/.env` or set variables in your environment:
```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/jeetpoint?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_SERVICE_ACCOUNT=you_serviceAccountKey
```

### Obtain Firebase Service Account Credentials (Single-Method)

1. Go to **Firebase Console → Project Settings → Service Accounts**, then click **Generate new private key** and download the JSON file.

2. Copy the service account JSON and add it as a **single-line value** in `backend/.env`.  
   Make sure to **remove all spaces and line breaks** before saving.

## Usage

- Use the frontend UI to register/login (Firebase). The frontend will exchange Firebase ID tokens for JWTs for API access.
- Teacher routes are protected—authenticate and use teacher role to create quizzes.
- API endpoints are located under backend/routes (studentRoutes, teacherRoutes).
- Media uploads are handled via Cloudinary integration in backend/config.

## Future Improvements

- Role-based UI (admin dashboard)
- Add comprehensive unit/integration tests and CI
- Dockerize backend + frontend + MongoDB for reproducible environments
- Real-time leaderboards and WebSocket-based live contests
- Improved accessibility and mobile responsive design

## Author & License

Author: JEET-Point — Student project by MADHURA WALAWALKAR

License: This project was developed as a student/educational project and is provided for learning and demonstration purposes. Reuse for non-commercial educational purposes is allowed. No warranty. If you require a formal license for other uses, please contact the author or maintainers.
