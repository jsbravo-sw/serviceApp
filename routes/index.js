const express = require("express");
const router = express.Router();
const mu = require("../db/MongoUtils.js");
const ObjectID = require("mongodb").ObjectID;

/* GET home page. */


/*
Recomiendo utilizar varios routes en vez de sólo el del index.js y manejarlos según el modelo/rol de la página.
Por ejemplo:
  Un archivo llamado:
    empleado.js
  En empleado.js:
    router.post("/register", (req, res) => {...})
  Y en app.js:
    const empleadoRouter = require("./routes/empleado");
    app.use("/empleado", empleadoRouter);
  De manera que la ruta queda:
  "/register/empleado" y así pueden manejar de mejor manera las rutas y con más sentido.
  
  
  Por otra parte, recomiendo utilizar la asignación desestructurante 
  https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Destructuring_assignment
  
*/
router.post("/registerEmpleado", (req, res) => {
  //Asignación desestructurante de ES6
  const {username, ocupacion, experiencia} = req.body;
  mu.passport
    .cambiarTipo(req.user[0].email, "Empleado", username)
    .then(
      mu.passport
        .registerEmpleado(
          username,
          ocupacion,
          experiencia
        )
        .then(res.redirect("/"))
    );
});

router.get("/getEmpleado/:query", function (req, res) {
  mu.passport.getEmpleadoUser(req.params.query).then((user) => res.json(user));
});

router.post("/registerCliente", (req, res) => {
  mu.passport
    .cambiarTipo(req.user[0].email, "Cliente", req.body.username)
    .then(
      mu.passport.registerCliente(req.body.username).then(res.redirect("/"))
    );
});

router.post("/registroServicio", (req, res) => {
  mu.servicios
    .register(
      req.body.usernameC,
      req.body.usernameE,
      req.body.especificacion,
      "solicitado"
    )
    .then(res.redirect("/"));
});

router.get("/getAllE/:page", function (req, res) {
  mu.passport.getAllE(req.params.page).then((user) => res.json(user));
});

router.get("/getAllE/:page/:query", function (req, res) {
  let query = {};
  if (req.params.query != "all") {
    console.log("true");
    query = {
      ocupacion: new RegExp(`.*${req.params.query}.*`, "i")
    };
  }
  console.log(query);
  mu.passport.getAllEO(req.params.page, query).then((user) => res.json(user));
});

router.get("/getServicios", function (req, res) {
  mu.servicios.getAll().then((user) => res.json(user));
});

router.get("/getServicios/:query", function (req, res) {
  mu.servicios.getEmpleado(req.params.query).then((user) => res.json(user));
});

router.get("/getServiciosC/:query", function (req, res) {
  mu.servicios.getCliente(req.params.query).then((user) => res.json(user));
});

router.get("/aceptarServicio/:query", (req, res) => {
  //console.log(req.body.respuesta, req.user.username);
  mu.servicios.aceptar(new ObjectID(req.params.query)).then(res.redirect("/"));
});

router.post("/finalizarServicio", (req, res) => {
  console.log(req.body.comentarios);
  mu.servicios
    .finalizar(new ObjectID(req.body.id), req.body.comentarios)
    .then(res.redirect("/"));
});

router.post("/calificarServicio", (req, res) => {
  console.log(req.body.comentarios);
  mu.servicios
    .calificar(new ObjectID(req.body.id), req.body.calificacion)
    .then(res.redirect("/"));
});

module.exports = router;
