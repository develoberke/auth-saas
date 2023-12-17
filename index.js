require('dotenv').config();
const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./src/middlewares/errorHandler');
const db = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./src/routes/auth.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use(globalErrorHandler)

async function startApp() {
    try {
        await db.sequelize.sync();
        
        app.listen(PORT, () => {
            console.log('Server is running on port',PORT);
        });
    }
    catch (e) {
        console.log(e);
    }
}

startApp();