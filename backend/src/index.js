const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const syncRoutes = require("./routes/sync");
const submissionRoutes = require("./routes/submissions");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CP Tracker API running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
