// using mongoose with mongodb would have done the job more elegantly
// There are a security issues in this work
// This work is done in monolithic architecture

const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const morgan = require("morgan");
const { MongoClient, ServerApiVersion } = require("mongodb");

// use morgan in express
app.use([express.json(), morgan("combined"), cors()]);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSSWORD}@cluster0.5xxvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const tasksCollection = client.db("task").collection("tasks");
  } finally {
  }
}

app.get("/", (_, res) => {
  res.send("Hello world");
});

run().catch(console.dir);

app.listen(port, () => {
  console.log(`App in listening on port ${port}`);
});
