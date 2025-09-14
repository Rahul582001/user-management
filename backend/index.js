const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
const db = require("./db"); // ensure DB initialised

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send({ ok: true, msg: "User mgmt backend" }));

app.use("/api/users", usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
