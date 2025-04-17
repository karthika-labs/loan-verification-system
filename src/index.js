import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes.js';
import loanRoutes from './routes/LoanRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Loan Application and Verification System');
});

const PORT = process.env.PORT || 5123;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
