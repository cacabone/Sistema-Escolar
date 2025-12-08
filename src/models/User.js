import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ["admin", "profesor", "estudiante"], default: "estudiante" },
});

userSchema.pre("save", async function () {
  if (!this.isModified("contraseña")) return;
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
});

export default mongoose.model("User", userSchema);
