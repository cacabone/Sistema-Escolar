import request from "supertest";
import app from "../server.js";
import { connect, closeDatabase } from "./setupMongo.js";

describe("Panel de Administración", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("TA-09: Debería permitir acceso a admin", async () => {
    const agent = request.agent(app);
    await agent.post("/register").send({
      nombre: "Admin",
      correo: "admin@example.com",
      contraseña: "adminpass",
      contraseñaConfirm: "adminpass",
      rol: "admin",
    });
    await agent.post("/login").send({ correo: "admin@example.com", contraseña: "adminpass" });
    const res = await agent.get("/admin");
    expect(res.statusCode).toBe(200);
  });

  it("No debería permitir acceso si no es admin", async () => {
    const agent = request.agent(app);
    await agent.post("/register").send({
      nombre: "User",
      correo: "user@example.com",
      contraseña: "userpass",
      contraseñaConfirm: "userpass",
      rol: "estudiante",
    });
    await agent.post("/login").send({ correo: "user@example.com", contraseña: "userpass" });
    const res = await agent.get("/admin");
    expect([302, 403]).toContain(res.statusCode);
  });
});
