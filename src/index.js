const express = require("express");
const bodyParser = require("body-parser");
const { prisma } = require("../db/config");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get("/", (_, res) => {
  res.send("hello world");
});

app.post("/create", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const newTodo = await prisma.todos.create({
      data: {
        task,
      },
    });

    return res.status(201).json({ id: newTodo.id, message: "Todo is created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/getAll', async (req, res) => {
  let todos = []
  try {
    const response = await prisma.todos.findMany();
    for (i of response) {
      todos.push(i)
    }
    res.status(200).send({ "todos": todos })
  } catch (err) {
    console.log(err)
    res.status(400).send({ "message": "Todo not found" })
  }
})
app.patch('/update/:id', async (req, res) => {
  const { id } = req.headers;
  const { task, completed } = req.body;
  if (!task || !completed) {
    res.status(200).send({ "message": "No fields provided to update" })
  }
  try {
    const updatedTodo = await prisma.todos.update({
      where: { id },
      data: { task, completed }
    })
    res.status(200).send({ message: "Todo is updated", updatedTodo })

  } catch (err) {
    console.log(err)
    res.status(400).send({ "message": "Todo not found" })
  }
})

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.headers;
  try {
    await prisma.todos.delete({
      where: { id }
    })
    res.status(200).send({ "message": "Todo is Deleted" })
  } catch (err) {
    console.log(err)
    res.status(400).send({ "message": "Todo not found" })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
