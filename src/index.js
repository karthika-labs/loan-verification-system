import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes.js';
import loanRoutes from './routes/LoanRoutes.js';
import DashboardRoutes from './routes/DashboardRoutes.js';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url';






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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = "const uploadsDir = '/Users/gowtham-tt0586/Documents/CSG DOCS/Karthika/loan-app-versys-backend/loan-verification-system/uploads";
// Ensure this Express setup is aligned properly
app.use('/uploads', express.static('/Users/gowtham-tt0586/Documents/CSG DOCS/Karthika/loan-app-versys-backend/loan-verification-system/uploads'));

app.get('/', (req, res) => {
  res.send('Welcome to Loan Application and Verification System');
});

const PORT = process.env.PORT || 5123;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
