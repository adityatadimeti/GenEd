const http = require('http');
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css"

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
});

function App ()
{
    console.log (import.meta.env.VITE_Open_AI_Key);
    // const configuration = new Configuration ({
    //     apiKey: 
    // })
}



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});