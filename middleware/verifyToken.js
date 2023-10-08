import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  //Si no existe el token
  if (!token) {
    return res.status(401).json({ mensaje: "No estas Autenticado!" });
  }

  jwt.verify(token, process.env.CLAVE_SECRETA, (err, user) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .clearCookie("token")
        .json({ mensaje: "El token no es valido!" });
    }

    req.user = user;
    next();
  });
};

export { verifyToken };
