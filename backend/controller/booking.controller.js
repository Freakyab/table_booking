const express = require("express");
const router = express.Router();
const User = require("../model/User");

// GET route to fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("time date").sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
});

router.post("/getDate", async (req, res) => {
  try {
    const date = req.body.date;
    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "Date is required",
      });
    }
    //  find all users whose time is greater than the current time

    const users = await User.find(
      { createdAt: { $gte: date.split("T")[0] } },
      null,
      {
        sort: { time: 1 },
      }
    );

    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
});

// POST route to add a new user
router.post("/add", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    specialRequests,
    time,
    partySize,
    date,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !time ||
    !date ||
    !partySize
  ) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }
  const user = new User({
    time,
    partySize,
    firstName,
    lastName,
    date,
    email,
    phone,
    specialRequests,
  });


  try {
    const savedUser = await user.save();
    res.status(201).json({
      status: "success",
      message: "User added successfully",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to add user",
      error: error.message,
    });
  }
});

// DELETE route to remove a user
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required",
    });
  }

  try {
    const removedUser = await User.findByIdAndDelete(userId);

    if (!removedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: removedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

module.exports = router;
