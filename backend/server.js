const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const { initializeFirebase } = require('./config/firebaseAdmin');
require('./config/cloudinary'); // configure cloudinary (side-effect)

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// initialize external services / DB
initializeFirebase();
connectDB();

// mount routes
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);

// root health
app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
