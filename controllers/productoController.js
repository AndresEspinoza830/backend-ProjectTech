import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";

const crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
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
    const producto = await Producto.findOne({ _id: idProducto })
      .populate("categoria", " -createdAt -updatedAt -__v")
      .select("-createdAt -updatedAt -__v");
    res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    next();
  }
};

const crearCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(200).json(categoria);
  } catch (error) {
    console.log(error);
    next();
  }
};

const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({});
    return res.status(200).json(categorias);
  } catch (error) {
    console.log(error);
  }
};

export {
  crearProducto,
  listarProductosDestacados,
  listarProductos,
  crearCategoria,
  listarCategorias,
  consultarProducto,
};
