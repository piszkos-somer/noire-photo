const express = require("express");
const app = express();

const PORT = 3001;
app.get("/", (req, res) => res.send("Szerver él!"));
app.listen(PORT, () => console.log(`✅ Teszt szerver fut a ${PORT} porton!`));
