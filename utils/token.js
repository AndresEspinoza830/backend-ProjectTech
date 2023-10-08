import jwt from "jsonwebtoken";

const generarToken = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32);
};

const generarJWT = (id, nombre) => {
  return jwt.sign({ id: id, username: nombre }, process.env.CLAVE_SECRETA, {
    expiresIn: "1h",
  });
};

export { generarToken, generarJWT };
