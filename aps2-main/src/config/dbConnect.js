import mongoose from "mongoose";

async function connectToDatabase(){
    mongoose.connect("mongodb+srv://davicoenerosa:Jenio123456@cluster0.0uey47a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    return mongoose.connection;
}

export default connectToDatabase();

