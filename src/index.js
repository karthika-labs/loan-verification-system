import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes.js';
import loanRoutes from './routes/LoanRoutes.js';
import DashboardRoutes from './routes/DashboardRoutes.js';





// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // Replace with your front-end URL
  credentials: true,                // Allow credentials (cookies, authorization headers, etc.)
};



dotenv.config();

const app = express();
app.use(cors(corsOptions));
//app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api', DashboardRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Loan Application and Verification System');
});

const PORT = process.env.PORT || 5123;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
