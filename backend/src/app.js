const express = require("express");
const cors = require("cors");

const app = express();

const aiRoutes = require("./routes/ai.routes");

app.use(cors());

app.use(express.json());




app.get("/", (req, res) => {
    res.send("AI Code Reviewer API is running");
});

app.use("/ai", aiRoutes);

module.exports = app;