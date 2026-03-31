const express = require("express");
const server = express();

server.use(express.json());

server.get("/",(req,res) =>{
    return res.json("Olá, Mundo!");
})

server.listen(3001);