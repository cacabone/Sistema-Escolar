import request from "supertest";
import app from "../server.js";
import { connect, closeDatabase } from "./setupMongo.js";

describe("Autenticación", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("TA-01: Debería registrar un usuario nuevo", async () => {
    const res = await request(app).post("/register").send({
      nombre: "Usuario Test",
      correo: "test1@example.com",
      contraseña: "123456",
      contraseñaConfirm: "123456",
      rol: "estudiante",
    });
    expect(res.statusCode).toBe(302);
  });

  it("TA-02: No debería permitir registro duplicado", async () => {
    const agent = request.agent(app);
    // First register
    await agent.post("/register").send({
      nombre: "Usuario Test",
      correo: "dup@example.com",
      contraseña: "123456",
      contraseñaConfirm: "123456",
      rol: "estudiante",
    });
    // Attempt duplicate registration
    const res = await agent.post("/register").send({
      nombre: "Usuario Test",
      correo: "dup@example.com",
      contraseña: "123456",
      contraseñaConfirm: "123456",
      rol: "estudiante",
    });
    // Should redirect back to /register and set flash; follow up GET to inspect flash content
    expect(res.statusCode).toBe(302);
    const follow = await agent.get("/register");
    expect(follow.text).toContain("El correo ya está registrado");
  });

  it("TA-03: Debería iniciar sesión correctamente", async () => {
    const agent = request.agent(app);
    // register and login
    await agent.post("/register").send({
      nombre: "Usuario Login",
      correo: "login@example.com",
      contraseña: "123456",
      contraseñaConfirm: "123456",
      rol: "estudiante",
    });
    const res = await agent.post("/login").send({ correo: "login@example.com", contraseña: "123456" });
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/courses");
  });

  it("TA-04: Debería rechazar login con credenciales incorrectas", async () => {
    const agent = request.agent(app);
    await agent.post("/register").send({
      nombre: "Usuario Wrong",
      correo: "wrong@example.com",
      contraseña: "123456",
      contraseñaConfirm: "123456",
      rol: "estudiante",
    });
    const res = await agent.post("/login").send({ correo: "wrong@example.com", contraseña: "wrongpass" });
    // failed login redirects back to /login with flash
    expect(res.statusCode).toBe(302);
    const follow = await agent.get("/login");
    expect(follow.text).toContain("Correo o Contraseña incorrectos");
  });
});
