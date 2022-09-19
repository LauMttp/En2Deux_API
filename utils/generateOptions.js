const Option = require("../models/Option.model");
const Attendee = require("../models/Attendee.model");
const Event = require("../models/Event.model");

async function generateOptions(event) {
  try {
    console.log("yooooo");
    // Find event
    // if timerange = true : create an array with an object for each date of the time range and a key "score : 0"
    // if location to be determine : create an array with an object for each location and a key "score : 0"
    // create an empty array budget
    const myEvent = await Event.findById(event._id);
    // Find attendees of the event
    const myAttendees = await Attendee.find({ event: myEvent.id });
    // For each attendee --> Get the availabilities array + budget + location wish
    // for each date of the availabilities array : make the corresponding object score increase by 1 (point)
    // push budget inside the event budget array
    // for each attendee's location wish -> make the corresponding location object score increase by 1 (point)
    myAttendees.forEach((x) => {});
    //create date options with the event.duration and with a total score associated (=sum of the score of each day)
    // sort the date options array by score
    // sort the locations array by score
    // Sort budget array by price —> croissant

    // V1 =====>>>>> Options : best scored Date, location and budget[0]
    // fetch request on Airbnb API

  } catch (error) {
    next(error);
  }
}

module.exports = generateOptions;
