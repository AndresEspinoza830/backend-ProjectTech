import Categoria from "../models/Categoria.js";

const crearCategoria = async (req, res) => {
  try {
    const categoria = await Categoria(req.body);
    res.status(200).json(categoria);
  } catch (error) {
    console.log(error);
  }
};

const consultarCategoria = async (req, res, next) => {
  const { idCategoria } = req.params;
  try {
    const categoria = await Categoria.findById(idCategoria);
    res.status(200).json(categoria);
  } catch (error) {
    console.log(error);
    next();
  }
};

const listarCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.find({});
    res.status(200).json(categorias);
  } catch (error) {
    console.log(error);
    next();
  }
};

const actualizarCategoria = async (req, res, next) => {
  const { idCategoria } = req.params;
  try {
    const categoria = await Categoria.findByIdAndUpdate(idCategoria, req.body, {
      new: true,
    });
    res.status(200).json(categoria);
  } catch (error) {
    console.log(error);
    next();
  }
};

const eliminarCategoria = async (req, res, next) => {
  const { idCategoria } = req.params;
  try {
    await Categoria.findByIdAndRemove(idCategoria);
    res.status(200).json({ msg: "Eliminado" });
  } catch (error) {
    console.log(error);
    next();
  }
};

export {
  crearCategoria,
  consultarCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria,
};
