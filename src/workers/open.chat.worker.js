import { Worker } from "bullmq";

new Worker(
  "open-chat",
  async (job) => {

    console.log("Enviando correo a:", job.data?.email);

    // simulación
    await new Promise(resolve =>
      setTimeout(resolve, 3000)
    );

    console.log("Correo enviado");

  }
);a