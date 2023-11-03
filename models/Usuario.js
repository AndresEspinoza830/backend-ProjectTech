import mongoose from "mongoose";

const schemaUsuario = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: "",
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
    productos: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Producto", default: [] },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Usuario", schemaUsuario);
