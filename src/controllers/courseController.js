import Course from "../models/Course.js";

// Mostrar formulario para crear curso
export const showCreateCourse = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "profesor") {
    return res.status(403).send("Acceso denegado: solo profesores pueden crear cursos");
  }
  res.render("courses/create", { user: req.session.user });

// Crear un nuevo curso
export const createCourse = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const profesor = req.session.user._id;

    if (!titulo || !descripcion) return res.send("Todos los campos son obligatorios");

    const nuevoCurso = new Course({ titulo, descripcion, profesor });
    await nuevoCurso.save();

    res.redirect("/courses");
  } catch (err) {
    console.error(err);
    res.send("Error al crear el curso");
  }
};

// Listar cursos (para todos los usuarios autenticados)
export const listCourses = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/login");

    const user = req.session.user;
    let query = {};

    // If the logged-in user is a professor, show only their courses
    if (user.rol === "profesor") {
      query = { profesor: user._id };
    }

    const cursos = await Course.find(query).populate("profesor", "nombre correo");
    res.render("courses/list", { user, cursos });
  } catch (err) {
    console.error(err);
    res.send("Error al cargar los cursos");
  }
};

// Mostrar formulario de edición de curso
export const showEditCourse = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/login");
    const { id } = req.params;
    const curso = await Course.findById(id).populate("profesor", "nombre correo");
    if (!curso) return res.status(404).send("Curso no encontrado");

    const user = req.session.user;
    // Sólo el profesor dueño del curso o admin pueden editar
    if (user.rol !== "admin" && curso.profesor._id.toString() !== user._id) {
      return res.status(403).send("Acceso denegado: no puedes editar este curso");
    }

    res.render("courses/edit", { user, curso });
  } catch (err) {
    console.error(err);
    res.send("Error al cargar el formulario de edición");
  }
};

// Actualizar curso
export const updateCourse = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/login");
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    const curso = await Course.findById(id);
    if (!curso) return res.status(404).send("Curso no encontrado");

    const user = req.session.user;
    if (user.rol !== "admin" && curso.profesor.toString() !== user._id) {
      return res.status(403).send("Acceso denegado: no puedes editar este curso");
    }

    if (!titulo || !descripcion) return res.send("Todos los campos son obligatorios");

    curso.titulo = titulo;
    curso.descripcion = descripcion;
    await curso.save();

    res.redirect("/courses");
  } catch (err) {
    console.error(err);
    res.send("Error al actualizar el curso");
  }
};

// Eliminar curso
export const deleteCourse = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/login");
    const { id } = req.params;

    const curso = await Course.findById(id);
    if (!curso) return res.status(404).send("Curso no encontrado");

    const user = req.session.user;
    if (user.rol !== "admin" && curso.profesor.toString() !== user._id) {
      return res.status(403).send("Acceso denegado: no puedes eliminar este curso");
    }

    await Course.deleteOne({ _id: id });
    res.redirect("/courses");
  } catch (err) {
    console.error(err);
    res.send("Error al eliminar el curso");
  }
};
