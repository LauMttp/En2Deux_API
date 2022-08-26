const router = require("express").Router();
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
router.post('/attendee', async (req, res, next) => {
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
router.post('/vote', async (req, res, next) => {
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

//display event linked to one user - Kash
router.get('/event/:idUser', async (req, res, next) => {
  try{
    const idUser = req.params;
  }catch(error){
    next(error);
  }
});

router.use("/auth", authRoutes);

module.exports = router;
