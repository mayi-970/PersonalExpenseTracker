 import express from 'express';
 import cors from 'cors';
 import 'dotenv/config';
 import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import incomeRouter from './routes/incomeRoute.js';
import expenseRouter from './routes/expenseRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
import supportRouter from './routes/supportRoute.js';

 const app = express();
 const port = 4000;

 //middle ware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));


 //db
connectDB();

 //routes
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/support", supportRouter);


 app.get('/',(req,res) => {
    res.send("API WORKING...")
 });

 app.listen(port,()=> {
    console.log(`Server Started on http://localhost:${port}`);
 });
