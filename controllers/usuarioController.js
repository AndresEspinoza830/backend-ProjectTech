import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarToken, generarJWT } from "../utils/token.js";
import {
  emailRegistroPassword,
  emailRecuperarPassword,
} from "../utils/emaill.js";

const registrarUsuario = async (req, res) => {
  try {
    //validacion
    await check("username")
      .notEmpty()
      .withMessage("El username es obligatorio")
      .run(req);
    await check("email")
      .isEmail()
      .withMessage("Eso no parece un email")
      .run(req);
    await check("password")
      .isLength({ min: 6 })
      .withMessage("El password debe tener minimo 6 caracteres")
      .run(req);

    let resultado = validationResult(req);

    //Si hay errores
    if (!resultado.isEmpty()) {
      return res.status(400).json(resultado.array());
    }

    //Verificar que el usuario no sea repetido
    const usuarioRepetido = await Usuario.findOne({ email: req.body.email });

    //Si hay usuario repetido
    if (usuarioRepetido) {
      return res.status(400).json({ mensaje: "El usuario ya existe!" });
    }

    //Hasheamos el password
    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(req.body.password, salt);

    //Creamos el usuario
    const usuario = await Usuario.create({
      username: req.body.username,
      email: req.body.email,
      password: passwordHash,
      token: generarToken(),
    });

    //Enviamos un correo para confirmar su cuenta
    emailRegistroPassword(usuario.username, usuario.email, usuario.token);

    return res.status(200).json({
      mensaje: "Usuario registrado correctamente, te enviamos un correo",
    });
  } catch (error) {
    console.log("Hubo un error:", error);
    return res.status(500).json({ mensaje: "Hubo un error en el servidor" });
  }
};

const confirmarCuentaRegistro = async (req, res) => {
  try {
    //validando el token
    const usuario = await Usuario.findOne({ token: req.params.token });

    //Si no existe el usuario con el token
    if (!usuario) {
      return res.status(401).json({ mensaje: "No tienes acceso" });
    }

    //Si existe
    usuario.token = "";
    usuario.confirmado = true;
    await usuario.save();

    return res
      .status(200)
      .json({ mensaje: "Cuenta confirmada, Ya puedes iniciar Sesion!" });
  } catch (error) {
    console.log("Hubo un error", error);
    res.status(500).json({ mensaje: "Hubo un error en el servidor" });
  }
};

const olvidePassword = async (req, res) => {
  try {
    //validando el token
    const usuario = await Usuario.findOne({ email: req.body.email });

    //Si no existe el usuario con el token
    if (!usuario) {
      return res.status(401).json({ mensaje: "El usuario no existe" });
    }

    //generamos un token
    usuario.token = generarToken();
    await usuario.save();

    //Enviamos el correo para valdiar la cuenta
    await emailRecuperarPassword(
      usuario.username,
      usuario.email,
      usuario.token
    );

    res.status(200).json({ mensaje: "Enviamos un mensaje a tu correo" });
  } catch (error) {
    console.log("Hubo un error", error);
    res.status(500).json({ mensaje: "Hubo un error en el servidor" });
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  try {
    //validando el token
    const usuario = await Usuario.findOne({ token: token });

    //Si no existe el usuario con el token
    if (!usuario) {
      return res.status(401).json({ mensaje: "Acceso no autorizado!" });
    }
    return res.status(200).json({ mensaje: "Token valido" });
  } catch (error) {
    console.log("Hubo un error", error);
    res.status(500).json({ mensaje: "Hubo un error en el servidor" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    //validando el token
    const usuario = await Usuario.findOne({ token });

    //Hasheamos el nuevo password
    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(password, salt);

    usuario.password = passwordHash;
    usuario.token = "";
    await usuario.save();

    return res
      .status(200)
      .json({ mensaje: "Password modificado correctamente" });
  } catch (error) {
    console.log("Hubo un error", error);
    res.status(500).json({ mensaje: "Hubo un error en el servidor" });
  }
};

const autenticar = async (req, res) => {
  try {
    await check("email")
      .isEmail()
      .withMessage("Eso no parece un email")
      .run(req);
    await check("password")
      .isLength({ min: 6 })
      .withMessage("El password debe tener minimo 6 caracteres")
      .run(req);

    let resultado = validationResult(req);

    //Si hay errores
    if (!resultado.isEmpty()) {
      return res.status(400).json(resultado.array());
    }

    //Verificar que el usuario exista
    const usuario = await Usuario.findOne({ email: req.body.email });

    if (!usuario) {
      return res.status(400).json({ mensaje: "No existe el usuario" });
    }

    console.log(usuario);

    //Verficar el password
    const verificarPassword = await bcrypt.compare(
      req.body.password,
      usuario.password
    );

    if (!verificarPassword) {
      return res.status(401).json({ mensaje: "El password es incorrecto" });
    }

    //Verficar si esta confirmada la cuenta
    if (!usuario.confirmado) {
      return res.status(401).json({ mensaje: "La cuenta no esta confirmada" });
    }

    //Generar JWT
    const token = generarJWT(
      usuario._id,
      usuario.username,
      usuario.email,
      usuario.productos
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expire: "1h",
      })
      .status(200)
      .json({
        id: usuario._id,
        username: usuario.username,
        email: usuario.email,
        productos: usuario.productos,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Hubo un error en el servidor" });
  }
};

const mostrarProductosCliente = async (req, res) => {
  const { idCliente } = req.params;
  try {
    const cliente = await Usuario.findById(idCliente).populate(
      "productos",
      "-createdAt -updatedAt -__v"
    );

    if (!cliente) return res.status(404).json({ msg: "No existe el usuario" });

    return res.status(200).json(cliente.productos);
  } catch (error) {
    console.log(error);
  }
};

export {
  registrarUsuario,
  confirmarCuentaRegistro,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  mostrarProductosCliente,
};
