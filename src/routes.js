import { Router } from "express";
import UserController from "./app/controllers/UserController"
import PlanController from "./app/controllers/PlanController"
import RegistrationController from "./app/controllers/RegistrationController"

import SessionController from "./app/controllers/SessionController"

import AuthMiddleware from "./app/middlewares/auth"

const routes = new Router()

//rotas para login
routes.post("/sessions", SessionController.store)

//rotas públicas de usuário
routes.get("/users", UserController.show)
routes.get("/users/:id", UserController.index)
routes.post("/users", UserController.store)

routes.use(AuthMiddleware)

//rotas privadas de usuário
routes.put("/users/", UserController.update)
routes.delete("/users/", UserController.delete)

//rotas privadas para criar plano
routes.post("/plan", PlanController.store)
routes.get("/plan", PlanController.show)
routes.get("/plan/:id", PlanController.index)
routes.put("/plan/:id", PlanController.update)
routes.delete("/plan/:id", PlanController.delete)

//rotas privadas para criar matrícula
routes.get("/registration", RegistrationController.show)
routes.get("/registration/:id", RegistrationController.index)
routes.post("/registration", RegistrationController.store)
routes.put("/registration/:id", RegistrationController.update)
routes.delete("/registration/:id", RegistrationController.delete)


export default routes