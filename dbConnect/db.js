import mongoose from "mongoose";

const mongoUrl =
  // "mongodb+srv://2223016:N6bVPiFwmE5hhoI5@cluster0.3dvrp.mongodb.net/Task-Box?retryWrites=true&w=majority";
  "mongodb://localhost:27017/Task-Box";

mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
    console.log("Please make sure MongoDB is installed and running");
  });

const db = mongoose.connection;
export default db;
