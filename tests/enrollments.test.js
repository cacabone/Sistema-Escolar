import request from "supertest";
import app from "../server.js";
import { connect, closeDatabase } from "./setupMongo.js";
import User from "../src/models/User.js";
import Course from "../src/models/Course.js";

describe("Inscripciones", () => {
  let courseId;

  beforeAll(async () => {
    await connect();
    // create a professor and a course
    const professor = new User({ nombre: "Prof", correo: "prof@example.com", contraseña: "pass123", rol: "profesor" });
    await professor.save();
    const course = new Course({ titulo: "Curso Test", descripcion: "Desc", profesor: professor._id });
    await course.save();
    courseId = course._id.toString();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("Debería inscribir a un estudiante en un curso", async () => {
    const agent = request.agent(app);

    // register student and login
    await agent.post("/register").send({
      nombre: "Estudiante",
      correo: "est@example.com",
      contraseña: "estpass",
      contraseñaConfirm: "estpass",
      rol: "estudiante",
    });
    await agent.post("/login").send({ correo: "est@example.com", contraseña: "estpass" });

    const res = await agent.post(`/enroll/${courseId}`).send();
    expect(res.statusCode).toBe(302);
  });
});
