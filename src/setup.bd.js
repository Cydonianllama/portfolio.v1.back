// bd
import mongoose from 'mongoose';
const MONGO_URI = 'mongodb://localhost:27017/portfoliov1' //process.env.MONGO_URI!;

/*
mongoose.connection.readyState
0 = disconnected
1 = connected
2 = connecting
3 = disconnecting
*/



export async function setupMongo() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Mongo ya conectado");
      return;
    }

    await mongoose.connect(MONGO_URI, {
      dbName: "porfolio",
    });

    console.log("Mongo conectado");

    // Ping real a la DB
    await mongoose.connection.db.admin().ping();

    console.log("Ping OK");
  } catch (error) {
    console.error("Error conectando Mongo:", error);

    process.exit(1);
  }
}
