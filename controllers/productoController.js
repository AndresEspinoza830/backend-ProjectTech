import Producto from "../models/Producto.js";
import { uploadImage } from "../config/cloudinary.js";

const crearProducto = async (req, res) => {
  const { nombre, descripcion, categoria, precio } = req.body;
  try {
    const producto = new Producto({
      nombre,
      descripcion,
      categoria,
      precio,
    });
    console.log(req.files.imagen.tempFilePath);

    if (req.files?.imagen) {
      const result = await uploadImage(req.files.imagen.tempFilePath);
      producto.imagen.public_id = result.public_id;
      producto.imagen.secure_url = result.secure_url;
    }

    await producto.save();
    res.status(200).json(producto);
  } catch (error) {
    console.log(error);
  }
};

const listarProductosDestacados = async (req, res) => {
  const { destacado, limit } = req.query;
  try {
    const productos = await Producto.find({
      destacado: destacado || false,
    }).limit(limit || 4);
    res.status(200).json(productos);
  } catch (error) {
    console.log(error);
  }
};

const listarProductos = async (req, res, next) => {
  const { buscar, categoria, precio } = req.query;
  const query = {};

  console.log(req.files);

  if (buscar) {
    query.nombre = new RegExp(buscar, "i");
  }

  if (categoria) {
    query.categoria = categoria;
  }

  if (precio === "0") {
    query.precio = 0;
  } else if (precio === "1") {
    query.precio = { $ne: 0 };
  }

  try {
    const productos = await Producto.find(query).limit(100);

    res.status(200).json(productos);
  } catch (error) {
    console.log(error);
    next();
  }
};

const consultarProducto = async (req, res, next) => {
  const { idProducto } = req.params;
  try {
    // const objectId = mongoose.Types.ObjectId(idProducto);
    const producto = await Producto.findById(idProducto)
      .populate("categoria", " -createdAt -updatedAt -__v")
      .select("-createdAt -updatedAt -__v");
    res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    next();
  }
};

export {
  crearProducto,
  listarProductosDestacados,
  listarProductos,
  consultarProducto,
};
