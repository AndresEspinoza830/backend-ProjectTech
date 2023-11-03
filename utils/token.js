import jwt from "jsonwebtoken";

const generarToken = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32);
};

const generarJWT = (id, nombre, email, productos) => {
  return jwt.sign(
    { id, username: nombre, email, productos },
    process.env.CLAVE_SECRETA,
    {
      expiresIn: "1h",
    }
  );
};

export { generarToken, generarJWT };
