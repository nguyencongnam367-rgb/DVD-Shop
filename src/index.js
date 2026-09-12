const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { engine } = require("express-handlebars");

const route = require("./resources/Routers/index");

app.use(express.static(path.join(__dirname, "public")));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

route(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
