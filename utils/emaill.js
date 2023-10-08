import nodemailer from "nodemailer";

const emailRegistroPassword = async (username, email, token) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  await transport.sendMail({
    from: "BienesRaices.com", // sender address
    to: email, // list of receivers
    subject: username, // Subject line
    text: "Confirmacion de Cuenta", // plain text body
    html: `
        <p>Hola ${username}!, comprueba tu cuenta en Project Tech</p>
        <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>

    `,
  });
};

const emailRecuperarPassword = async (username, email, token) => {
  // TODO: Mover hacia variables de entorno
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  await transport.sendMail({
    from: "BienesRaices.com", // sender address
    to: email, // list of receivers
    subject: username, // Subject line
    text: "Reestablecer de Password", // plain text body
    html: `
        <p>Hola ${username}!, reestablece tu password Project Tech dando click al enlace:</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablece Password</a>

        <p>Si no fuiste tu, ignora este mensaje</p>

    `,
  });
};

export { emailRegistroPassword, emailRecuperarPassword };
