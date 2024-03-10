const express = require("express");
const Exa = require("exa-js");

const exa = new Exa(process.env.EXA_API_KEY);

const app = express();
const port = 8000;

app.use(express.json()); // This line is necessary to parse JSON request bodies

app.post("/api/search", async (req, res) => {
  const data = req.body;
  const exaRes = await exa.search(data.query, {
    numResults: data.numResults,
    useAutoprompt: data.useAutoprompt,
  });

  res.json(exaRes);
});