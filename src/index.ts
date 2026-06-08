import { setupMongo } from './setup.bd.js';
import express from 'express';
import methodOverride from "method-override";
import contactController from '@controllers/contact.controller.js';
import chatController from '@controllers/chat.controller.js';
import userController from '@controllers/user.controller.js';
import workspaceController from '@controllers/workspace.controller.js';
import authController from '@controllers/auth.controller.js'

import userBackofficeController from '@backoffice/user.controller.js'
import workspaceBackofficeController from '@backoffice/workspace.controller.js'

import dotenv from "dotenv";
import cors from "cors";
import { setupWebSocket } from './setup.websocket.js';

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
app.use('/api/chat', chatController);
app.use('/api/users', userController);
app.use('/api/workspaces', workspaceController);
app.use('/auth', authController);

// backoffices
app.use('/api/backoffice/users', userBackofficeController);
app.use('/api/backoffice/workspaces', workspaceBackofficeController);

await setupMongo();
await setupWebSocket(app);

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});