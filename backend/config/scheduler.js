const cron = require("node-cron");
const LiveClass = require("../model/liveClass");
const mongoose = require("mongoose");

// Function to update the class status
const updateClassStatus = async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0].substring(0, 5); // Get HH:MM format
    const todayDate = now.toISOString().split("T")[0]; // Get YYYY-MM-DD format

    // Activate classes that should start now
    await LiveClass.updateMany(
      { date: todayDate, time: currentTime, status: false },
      { $set: { status: true } }
    );

    // Deactivate classes that have ended
    await LiveClass.updateMany(
      { date: todayDate, endtime: currentTime, status: true },
      { $set: { status: false } }
    );

    console.log("Class status updated successfully.");
  } catch (error) {
    console.error("Error updating class status:", error);
  }
};

// Run the function every minute
cron.schedule("* * * * *", () => {
  console.log("Running status update...");
  updateClassStatus();
});

module.exports = updateClassStatus;
