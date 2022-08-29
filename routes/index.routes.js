const router = require("express").Router();

const jsonWebToken = require('jsonwebtoken');


const Attendee = require("../models/Attendee.model");
const User = require("../models/User.model");
const Vote = require("../models/Vote.model");
const authRoutes = require("./auth.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Create user / signup - Lau
router.post();

//Log in - Kash
router.post('/sign-in', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    if(!username || !password){
      return res.json({message: 'The username or password is missing, please provide the needed information(s) to complete the sign up.'});
    }

    const user = await User.findOne({username});
    if(!user){
      return res.status(400).json({message: 'The username is incorrect.'});
    }

    const matchingPassword = bcrypt.compareSync(password, user.password);
    if(!matchingPassword){
      return res.status(400).json({message: 'wrong credentials'});
    }
    
    const playload = {username};
    const token = jsonWebToken.sign(playload, process.env.TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1h'
    })

    res.status(200).json(token)
  } catch {
    next(error);
  }
});

// Create an event  - Lau
router.post();

//Invite people --> create attendee document - Kash
router.post('/event/attendee', async (req, res, next) => {
  try {
    const {event, user} = req.body;
    const createdAttendee = await Attendee.create({event, user});
    res.json(createdAttendee);

  } catch (error){
    next(error);
  }
});

//generate options - Lau
router.post();

//vote creation - Kash
router.post('/event/votes', async (req, res, next) => {
  try {
    const {attendee, firstChoice, secondChoice, thirdChoice} = req.body;
    const createdVote = await Vote.create({attendee, firstChoice, secondChoice, thirdChoice});
    res.json(createdVote);
  } catch (error) {
    next (error);
  }
});

//add friends - Lau
router.post();

// display user friends - Lau
router.get()

//display one event by ID (with attendees, options, votes, etc) - Kash
router.get('/events/:idEvent', isLoggedIn, async (req, res, next) => {
  try{
    const { idEvent } = req.params;
    const findEvent = await Event.findById({ _id : idEvent });
    const findOptions = await Option.find({ event : idEvent });
   
    //findAttendees is an Array
    const findAttendees = await Attendee.find({event : idEvent});

    //findVotes is an array of objects
    let findVotes = [];
    //For one attendee of findAttendees, 
    //I'll find his 3 votes and store them in votesOf.votes
    //Each attendee will have his own object named votesOf
    //and I'll store every votesOf objects in findVotes
    for (let attendee of findAttendees){
      const votesOf = {
        attendee : attendee.name,
        votes : [],
      };
      const findVotesOf = await Vote.find({attendee : attendee._id});
      votesOf.votes.push(findVotesOf);
      findVotes.push(votesOf);
    }

    const displayEvent = [findEvent, findOptions, findAttendees, findVotes];


    res.json(displayEvent);
  }catch(error){
    next(error);
  }
})

//display one event by name - Kash
router.get('/events', isLoggedIn, async (req, res, next) => {
  try{
    //comment recupérer l'id de l'user connecté ?
    //car je dois retourner que les events de cet User
    const {name} = req.body;
    const displayEvent = await Event.find({name});
    res.json(displayEvent);
  } catch(error){
    next(error);
  }
});

//display one option (with option ID and current votes) - Lau
router.get()

//display all events linked to one user - Kash
router.get('/events/:token');

//display all events - User role = admin - Lau
router.get()

//display all events - User role = attendee (notAdmin) - Lau
router.get()

// display all upcoming events linked to a user - Kash
router.get()

//delete event - Lau 
router.delete()

//delete options from event - Kash
router.delete()

//remove attendee from an event (isAdmin = true) - Lau
router.delete()

// remove user from friend list - Kash
router.delete()

//Update event informations - Lau
router.patch()

//Update options informations (isAdmin = true) - Kash
router.patch()

//Update user profile informations - Lau
router.patch()

//modify vote - Kash
router.patch()

//log out - Lau
router.post()



router.use("/auth", authRoutes);

module.exports = router;
