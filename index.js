const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3000;
const authRoute = require("./router/authRoute");
const mhsRoute = require("./router/mahasiswaRoute");
const fakultasRoute = require("./router/fakultasRoute");
const prodiRoute = require("./router/prodiRoute");

// Enable CORS for all routes
app.use(cors());

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/", authRoute, mhsRoute, fakultasRoute, prodiRoute);
// default route
app.get("/", (req, res) => {
  res.send("API absendi cendekia");
});
// buat server nya
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
