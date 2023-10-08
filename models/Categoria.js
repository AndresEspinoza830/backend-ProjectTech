import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Categoria", categoriaSchema);
