import express from "express";
import {
	showCreateCourse,
	createCourse,
	listCourses,
	showEditCourse,
	updateCourse,
	deleteCourse,
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

export default router;
