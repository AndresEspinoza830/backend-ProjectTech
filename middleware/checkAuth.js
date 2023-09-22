import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.CLAVE_SECRETA);
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );
      return next();
    } catch (error) {
      console.log(error);
      return res.status(404).json({ mensaje: "Hubo un error" });
    }
  }

  if (!token) {
    const error = new Error("Token no valido");
    res.status(401).json({ mensaje: error.message });
  }
};

export default checkAuth;
