import User from "../models/User.js";
import bcrypt from "bcrypt";

export const showLogin = (req, res) => res.render("auth/login");
export const showRegister = (req, res) => res.render("auth/register");

export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, rol } = req.body;
    // accept several possible password field names to avoid encoding issues
    const contraseña = req.body.contraseña || req.body.contrasena || req.body.password;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).send("Faltan campos requeridos: nombre, correo o contraseña");
    }

    const exists = await User.findOne({ correo });
    if (exists) return res.status(409).send("El correo ya está registrado");

    const user = new User({ nombre, correo, contraseña, rol });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    // include error message to help debugging during development
    res.status(500).send("Error al registrar usuario: " + (err.message || ""));
  }
};

export const loginUser = async (req, res) => {
  try {
    const { correo } = req.body;
    const contraseña = req.body.contraseña || req.body.contrasena || req.body.password;

    if (!correo || !contraseña) return res.status(400).send("Correo y contraseña requeridos");

    const user = await User.findOne({ correo });
    if (!user) return res.status(404).send("Usuario no encontrado");

    const valid = await bcrypt.compare(contraseña, user.contraseña);
    if (!valid) return res.status(401).send("Contraseña incorrecta");

    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).send("Error en login: " + (err.message || ""));
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al destruir la sesión:", err);
    }
    res.redirect("/login");
  });
};
