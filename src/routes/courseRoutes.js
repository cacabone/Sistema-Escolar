import express from "express";

const router = express.Router();

// Placeholder course routes
router.get("/", (req, res) => {
	res.send("Courses index");
});

export default router;
