import express from "express";
import {
	showCreateCourse,
	createCourse,
	listCourses,
	showEditCourse,
	updateCourse,
	deleteCourse,
	showCourseDetails,
} from "../controllers/courseController.js";
const router = express.Router();

// Ver todos los cursos
router.get("/", listCourses);
// Mostrar formulario de creación (solo profesores)
router.get("/create", showCreateCourse);

// Procesar creación de curso
router.post("/create", createCourse);

// Mostrar formulario de edición
router.get("/:id/edit", showEditCourse);

// Procesar edición
router.post("/:id/edit", updateCourse);

// Eliminar curso
router.post("/:id/delete", deleteCourse);

// Ver detalles de un curso (debe ir después de las rutas con prefijos como /create y /:id/edit)
router.get("/:id", showCourseDetails);

export default router;
