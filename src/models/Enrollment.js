import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  estudiante: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  curso: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  fechaInscripcion: { type: Date, default: Date.now },
});

enrollmentSchema.index({ estudiante: 1, curso: 1 }, { unique: true }); // evita inscripciones duplicadas

export default mongoose.model("Enrollment", enrollmentSchema);
