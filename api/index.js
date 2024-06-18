const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

mongoose
  .connect("mongodb+srv://dev:aadarsh@cluster0.3wfnadr.mongodb.net/")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("error connecting to mongodb", err);
  });

app.listen(port, () => {
  console.log(`server runing on port ${port}`);
});

//endpoint habit create

const Habit = require("./models/habit");

app.post("/habits", async (req, res) => {
  try {
    const { title, color, repeatMode, reminder } = req.body;
    const newHabit = new Habit({
      title,
      color,
      repeatMode,
      reminder,
    });
    const saveHabit = await newHabit.save();
    res.status(200).json(saveHabit);
  } catch (error) {
    res.status(500).json({ error: "network error1" });
  }
});

app.get("/habitslist", async (req, res) => {
  try {
    const allHabits = await Habit.find({});

    res.status(200).json(allHabits);
  } catch (error) {
    res.status(500).json({ error: "network error2" });
  }
});

app.put("/habits/:habitId/completed", async (req, res) => {
  const habitId = req.params.habitId;
  const updatedCompletion = req.body.completed; // The updated completion object

  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { completed: updatedCompletion },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    return res.status(200).json(updatedHabit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/habits/:habitId", async (req, res) => {
  try {
    const { habitId } = req.params;

    await Habit.findByIdAndDelete(habitId);

    res.status(200).json({ message: "Habit deleted succusfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete the habit" });
  }
});
