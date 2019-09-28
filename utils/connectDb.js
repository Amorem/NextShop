import mongoose from "mongoose";
const connection = {};

async function connectDb() {
  // Use existing database connection
  if (connection.isConnected) {
    console.log("Using existing db connection");
    return;
  }

  // Use a new database connection
  const db = await mongoose.connect(process.env.MONGO_SRV, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log("DB connected");
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
