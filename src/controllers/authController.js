import User from "../models/User.js";
import bcrypt from "bcrypt";

export const showLogin = (req, res) => {
  const flash = req.session.flash;
  req.session.flash = null;
  res.render("auth/login", { flash });
};

export const showRegister = (req, res) => {
  const flash = req.session.flash;
  req.session.flash = null;
  res.render("auth/register", { flash });
};

export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, rol } = req.body;
    // accept several possible password field names to avoid encoding issues
    const contraseña = req.body.contraseña || req.body.contrasena || req.body.password;
    const confirm = req.body.contraseñaConfirm || req.body.confirmContraseña || req.body.passwordConfirm;

    if (!nombre || !correo || !contraseña || !confirm) {
      req.session.flash = { type: "error", message: "Faltan campos requeridos" };
      return res.redirect("/register");
    }

    if (contraseña !== confirm) {
      req.session.flash = { type: "error", message: "Las contraseñas no coinciden" };
      return res.redirect("/register");
    }

    const exists = await User.findOne({ correo });
    if (exists) {
      req.session.flash = { type: "error", message: "El correo ya está registrado" };
      return res.redirect("/register");
    }

    const user = new User({ nombre, correo, contraseña, rol });
    await user.save();
    req.session.flash = { type: "success", message: "Registro exitoso. Por favor inicie sesión." };
    res.redirect("/login");
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    // include error message to help debugging during development
    req.session.flash = { type: "error", message: "Error al registrar usuario" };
    res.redirect("/register");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { correo } = req.body;
    const contraseña = req.body.contraseña || req.body.contrasena || req.body.password;

    if (!correo || !contraseña) {
      req.session.flash = { type: "error", message: "Correo o Contraseña incorrectos" };
      return res.redirect("/login");
    }

    const user = await User.findOne({ correo });
    const valid = user ? await bcrypt.compare(contraseña, user.contraseña) : false;
    if (!user || !valid) {
      req.session.flash = { type: "error", message: "Correo o Contraseña incorrectos" };
      return res.redirect("/login");
    }

    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error("Error en login:", err);
    req.session.flash = { type: "error", message: "Error en login" };
    res.redirect("/login");
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
