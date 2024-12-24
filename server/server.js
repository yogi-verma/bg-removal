import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';

// App Config
const PORT = process.env.PORT || 8080;
const app = express();

// API Routes
app.get('/', (req, res) => {
    res.status(200).send('API Working!!!');
})

// Initialize Middlewares
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {  
    connectDB();  
    console.log(`Server running on port ${PORT}`);
})