import request from "supertest";
import app from "../server.js";
import { connect, closeDatabase } from "./setupMongo.js";

describe("Cursos", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("TA-05: No debería permitir crear curso sin sesión", async () => {
    const res = await request(app).get("/courses/create");
    expect(res.statusCode).toBe(403);
  });

  it("TA-06: Debería crear curso como profesor", async () => {
    const agent = request.agent(app);
    // register and login as professor
    await agent.post("/register").send({
      nombre: "Profes Test",
      correo: "prof@example.com",
      contraseña: "profpass",
      contraseñaConfirm: "profpass",
      rol: "profesor",
    });
    await agent.post("/login").send({ correo: "prof@example.com", contraseña: "profpass" });

    const res = await agent.post("/courses/create").send({ titulo: "Curso Prueba", descripcion: "Descripción prueba" });
    expect(res.statusCode).toBe(302);
  });
});
