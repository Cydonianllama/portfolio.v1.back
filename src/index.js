import { setupMongo } from './setup.js';
import express from 'express';
import methodOverride from "method-override";
import contactController from './controllers/contact.controller.js';
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://myapp.com"
  ]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use('/api/contacts', contactController);

await setupMongo();

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});