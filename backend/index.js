"console.log('Server is running...');"
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend connected successfully!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

