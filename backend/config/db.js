import mongoose from "mongoose";
//usrname = ponnadamahesh23it_db_user;
//passwd = CPF6mNTmjPsz2MgT
export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://ponnadamahesh23it_db_user:CPF6mNTmjPsz2MgT@cluster0.l5dfu5v.mongodb.net/Expense")
        .then(() => console.log("DataBase Connection Established Succesfully..."));
}