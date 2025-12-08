import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// Inscribir estudiante en un curso
export const enrollInCourse = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.rol !== "estudiante") {
      req.session.flash = { type: "error", message: "Acceso denegado: solo estudiantes pueden inscribirse." };
      return res.redirect("/courses");
    }

    const { id } = req.params; // id del curso
    const curso = await Course.findById(id);
    if (!curso) {
      req.session.flash = { type: "error", message: "Curso no encontrado." };
      return res.redirect("/courses");
    }

    const existe = await Enrollment.findOne({
      estudiante: req.session.user._id,
      curso: id,
    });

    if (existe) {
      req.session.flash = { type: "error", message: "Ya estás inscrito en este curso." };
      return res.redirect("/courses");
    }

    const inscripcion = new Enrollment({
      estudiante: req.session.user._id,
      curso: id,
    });

    await inscripcion.save();
    // set a simple flash message in session to show feedback
    req.session.flash = { type: "success", message: "Inscripción realizada correctamente." };
    return res.redirect("/courses");
  } catch (err) {
    console.error(err);
    req.session.flash = { type: "error", message: "Error al inscribirse en el curso." };
    return res.redirect("/courses");
  }
};

// Ver estudiantes inscritos (solo profesor)
export const viewEnrollments = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.rol !== "profesor") {
      return res.status(403).send("Acceso denegado: solo profesores pueden ver inscripciones.");
    }

    const cursos = await Course.find({ profesor: req.session.user._id }).lean();
    const inscripciones = await Enrollment.find({ curso: { $in: cursos.map(c => c._id) } })
      .populate("curso", "titulo")
      .populate("estudiante", "nombre correo");

    res.render("courses/enrollments", { user: req.session.user, inscripciones });
  } catch (err) {
    console.error(err);
    res.send("Error al cargar las inscripciones.");
  }
};
