import Producto from "../models/Producto.js";
import { uploadImages, deleteImage } from "../config/cloudinary.js";
import multer from "multer";
import fs from "fs-extra";

// Configuración de almacenamiento
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop(); //TODO only pdf
    const filename = Date.now();
    cb(null, `${filename}.${ext}`);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});

// Instancias de Multer para PDF y para imágenes
const upload = multer({ storage });

// Middleware para subir archivos (PDF e imagen)
const subirArchivos = upload.fields([
  { name: "pdfn", maxCount: 1 },
  { name: "pdfb", maxCount: 1 },
  { name: "imagen", maxCount: 1 },
]);

const crearProducto = async (req, res) => {
  const { nombre, descripcion, categoria, precio } = req.body;
  try {
    const producto = new Producto({
      nombre,
      descripcion,
      categoria,
      precio,
    });

    if (req.files) {
      if (req.files?.pdfn) {
        // Asociar el nombre del archivo PDF al producto
        producto.pdf.normal = req.files.pdfn[0].filename;
      }

      if (req.files?.pdfb) {
        // Asociar el nombre del archivo PDF al producto
        producto.pdf.blur = req.files.pdfb[0].filename;
      }

      if (req.files?.imagen) {
        // Asociar el nombre del archivo de imagen al producto
        const result = await uploadImages(req.files?.imagen[0].path);

        producto.imagen.public_id = result.public_id;
        producto.imagen.secure_url = result.secure_url;

        //Eliminar el archivo de ./uploads
        await fs.unlink(req.files?.imagen[0].path);
      }
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
    const producto = await Producto.findById(idProducto)
      .populate("categoria", " -createdAt -updatedAt -__v")
      .select("-createdAt -updatedAt -__v");
    res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    next();
  }
};

const actualizarProducto = async (req, res) => {
  const { idProducto } = req.params;
  const { nombre, descripcion, precio, categoria } = req.body;
  try {
    const producto = await Producto.findById(idProducto);

    if (!producto)
      return res.status(404).json({ msg: "El producto no existe" });

    if (req.files) {
      if (req.files?.pdfn) {
        // Asociar el nombre del archivo PDF al producto
        producto.pdf.normal = req.files.pdfn[0].filename;
      }

      if (req.files?.pdfb) {
        // Asociar el nombre del archivo PDF al producto
        producto.pdf.blur = req.files.pdfb[0].filename;
      }

      if (req.files?.imagen) {
        // Asociar el nombre del archivo de imagen al producto
        const result = await uploadImages(req.files?.imagen[0].path);

        producto.imagen.public_id = result.public_id;
        producto.imagen.secure_url = result.secure_url;

        //Eliminar el archivo de ./uploads
        await fs.unlink(req.files?.imagen[0].path);
      }
    }

    producto.nombre = nombre || producto.nombre;
    producto.descripcion = descripcion || producto.descripcion;
    producto.precio = precio || producto.precio;
    producto.categoria = categoria || producto.categoria;

    await producto.save();
    return res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const eliminarProducto = async (req, res, next) => {
  const { idProducto } = req.params;
  try {
    const producto = await Producto.findByIdAndRemove(idProducto);

    if (!producto)
      return res.status(404).json({ msg: "El producto no existe" });

    if (producto?.imagen?.public_id) {
      await deleteImage(producto.imagen.public_id);
    }

    res.status(200).json({ msg: "Producto Eliminado" });
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
  actualizarProducto,
  eliminarProducto,
  subirArchivos,
};
