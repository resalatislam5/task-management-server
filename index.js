// using mongoose with mongodb would have done the job more elegantly
// There are a security issues in this work
// This work is done in monolithic architecture

const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const morgan = require("morgan");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

    // create a task
    app.post("/api/tasks", async (req, res) => {
      const { name, due_date, priority, tags } = req.body;
      const newbody = { name, due_date, priority, tags };
      const tasks = await tasksCollection.insertOne(newbody);
      res.status(200).send(tasks);
    });

    // tasks get method
    app.get("/api/tasks", async (_, res) => {
      const cursor = tasksCollection.find({});
      const tasks = await cursor.toArray();
      res.status(200).json(tasks);
    });
    // task update method
    app.put("/api/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const value = req.body;
      const options = { upsert: true };
      const updatedValue = {
        $set: value,
      };
      const task = await tasksCollection.updateOne(
        filter,
        updatedValue,
        options
      );
      res.status(200).json(task);
    });
    // delete a task
    app.delete("/api/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };

      const deletedTask = await tasksCollection.deleteOne(filter);

      res.status(200).json(deletedTask);
    });

    console.log("connected db");
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
