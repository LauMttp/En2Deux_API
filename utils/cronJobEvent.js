const CronJob = require("cron").CronJob;
const Event = require("../models/Event.model");
const generateOptions = require("./generateOptions");

// const date = new Date();
// date.setSeconds(date.getSeconds() + 5);

function createJob(event) {
  if (event.informationGatheringDeadline) {
    setVotingStage(event);
  }
  setUpcomingStage(event);
}

function setVotingStage(event) {
  const setToVoting = new CronJob(
    event.informationGatheringDeadline,
    async (event) => {
      const eventVotingStage = await Event.findByIdAndUpdate(
        event._id,
        { stage: "Voting stage" },
        { new: true }
      );
      generateOptions(event);
      console.log("Setting up the voting stage event");
    },
    null,
    true,
    "Europe/Paris"
  );
}

function setUpcomingStage(event) {
  const setToUpcoming = new CronJob(
    event.votingStageDeadline,
    async (event) => {
      const eventUpcomingStage = await Event.findByIdAndUpdate(
        event._id,
        { stage: "Upcoming" },
        { new: true }
      );
      console.log("Setting up the upcoming stage event");
    },
    null,
    true,
    "Europe/Paris"
  );
}

module.exports = createJob;
