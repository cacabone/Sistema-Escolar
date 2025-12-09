import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// Mostrar panel de administración
export const showAdminPanel = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.rol !== "admin") {
      return res.status(403).send("Acceso denegado: solo administradores pueden acceder.");
    }

    const usuarios = await User.find().select("nombre correo rol");
    const cursos = await Course.find().populate("profesor", "nombre");

    res.render("admin/panel", {
      user: req.session.user,
      usuarios,
      cursos,
    });
  } catch (err) {
    console.error(err);
    res.send("Error al cargar el panel de administración.");
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.rol !== "admin") {
      return res.status(403).send("Acceso denegado.");
    }

    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.send("Error al eliminar usuario.");
  }
};

// Eliminar curso
export const deleteCourse = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.rol !== "admin") {
      return res.status(403).send("Acceso denegado.");
    }

    const { id } = req.params;
    // remove enrollments related to this course first
    await Enrollment.deleteMany({ curso: id });
    await Course.findByIdAndDelete(id);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.send("Error al eliminar curso.");
  }
};

// Mostrar formulario de edición de usuario
export const showEditUser = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.rol !== "admin") {
      return res.status(403).send("Acceso denegado: solo administradores.");
    }

    const { id } = req.params;
    const usuario = await User.findById(id).select("nombre correo rol");
    if (!usuario) {
      req.session.flash = { type: "error", message: "Usuario no encontrado." };
      return res.redirect("/admin");
    }

    // Do not allow editing other admin accounts
    if (usuario.rol === "admin" && usuario._id.toString() !== req.session.user._id) {
      req.session.flash = { type: "error", message: "No se puede editar otro administrador." };
      return res.redirect("/admin");
    }

    res.render("admin/users", {
      user: req.session.user,
      usuario,
      flash: req.session.flash,
    });
    // clear flash after rendering
    req.session.flash = null;
  } catch (err) {
    console.error(err);
    res.send("Error al cargar el formulario de edición de usuario.");
  }
};

// Procesar actualización de usuario
export const updateUser = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.rol !== "admin") {
      return res.status(403).send("Acceso denegado: solo administradores.");
    }

    const { id } = req.params;
    const { nombre, correo, rol } = req.body;

    const usuario = await User.findById(id);
    if (!usuario) {
      req.session.flash = { type: "error", message: "Usuario no encontrado." };
      return res.redirect("/admin");
    }

    if (usuario.rol === "admin" && usuario._id.toString() !== req.session.user._id) {
      req.session.flash = { type: "error", message: "No se puede editar otro administrador." };
      return res.redirect("/admin");
    }

    // Basic validation
    if (!nombre || !correo) {
      req.session.flash = { type: "error", message: "Nombre y correo son requeridos." };
      return res.redirect(`/admin/user/${id}/edit`);
    }

    usuario.nombre = nombre;
    usuario.correo = correo;
    // Allow role changes except we keep a strict check that other admins can't be edited above
    if (rol) usuario.rol = rol;

    await usuario.save();
    req.session.flash = { type: "success", message: "Usuario actualizado correctamente." };
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.session.flash = { type: "error", message: "Error al actualizar usuario." };
    res.redirect(`/admin/user/${req.params.id}/edit`);
  }
};
