import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fechaCreacion: { type: Date, default: Date.now },
});

export default mongoose.model("Course", courseSchema);
