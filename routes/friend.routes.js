const router = require("express").Router();
const Friendship = require("../models/Friendship.model");

//send friendship request
router.post("/:requestedId", async (req, res, next) => {
  try {
    const { requestedId } = req.params;
    const friendshipExist = await Friendship.findOne({
      $or: [
        { requested: req.user.id, requestor: requestedId },

        { requested: requestedId, requestor: req.user.id }]
    })
    if(friendshipExist) {
      return res.status(400).json({ message: "You or your friend already send a freindship request." });
    }
    const newFriendshipRequest = await Friendship.create({
      requestor: req.user._id,
      requested: requestedId,
      status: "pending",
    });
    return res.status(201).json(newFriendshipRequest);
  } catch (error) {
    next(error);
  }
});



// display user friendships (accepted and pending)
router.get("/", async (req, res, next) => {
  try {
    const friends = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
      status: "accepted",
    }).populate("requested requestor")
    const friendRequests = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
      status: "pending",
    }).populate("requested requestor")

    const myFriendships = [{"friends" : friends, "friendRequests" : friendRequests }]

    return res.status(200).json(myFriendships);
  } catch (error) {
    next(error);
  }
});



//accept friendship request
router.patch("/:friendshipId", async (req, res, next) => {
  try {
    const { friendshipId } = req.params;
    const { answer } = req.body;
    const friendshipRequest = await Friendship.findById(friendshipId);
    console.log(friendshipRequest);
    if (!friendshipRequest) {
      return res
        .status(401)
        .json({ message: "This friendship request does not exist." });

    } else if (friendshipRequest.requested.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Invalid user, you can't answer this friendship request.",
      });
    } else if (
      friendshipRequest.status === "accepted" ||
      friendshipRequest.status === "declined"
    ) {
      return res
        .status(401)
        .json({ message: "You already answered this friendship request." });
    } else if (answer === "yes") {
      // friendshipRequest.status = "accepted";
      const friendshipAccepted = await Friendship.findByIdAndUpdate(
        friendshipId,
        { status: "accepted" },
        { new: true }
      );
      return res.status(201).json(friendshipAccepted);
    } else if (answer === "no") {
      const friendshipDeclined = await Friendship.findByIdAndUpdate(
        friendshipId,
        { status: "declined" },
        { new: true }
      );
      res.status(201).json(friendshipDeclined);
      const deletedRequest = await Friendship.findByIdAndDelete(friendshipId);
      return res.status(201).json(deletedRequest);
    }
  } catch (error) {
    next(error);
  }
});

// find friend or pending friend by username
router.get("/search", async (req, res, next) => {
  try {
    const { username } = req.query;
    const allMyFriendships = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
    }).populate("requested requestor");
    console.log(allMyFriendships)
    const arrFriends = [];
    for (let friendship of allMyFriendships) {
      if (friendship.requested.username === username) {
        arrFriends.push(friendship);
      } else if (friendship.requestor.username === username) {
        arrFriends.push(friendship);
      }
    }
    // v??rifier status ++ ajouter recherche by user name
    return res.status(201).json(arrFriends);
  } catch (error) {
    next(error);
  }
});


// remove user from friend list
router.delete("/:friendshipId", async (req, res, next) => {
  try {
    const { friendshipId } = req.params;
    const friendshipToBeDeleted = await Friendship.findById(friendshipId);
    if (
      friendshipToBeDeleted.requestor.toString() !== req.user.id &&
      friendshipToBeDeleted.requested.toString() !== req.user.id
    ) {
      return res.status(400).json({ message: "You can't do that.." });
    }
    if (
      friendshipToBeDeleted.requestor.toString() === req.user.id ||
      friendshipToBeDeleted.requested.toString() === req.user.id
    ) {
      const deleteFriendship = await Friendship.findByIdAndDelete(friendshipId);
      // check status number
      return res.status(200).json(deleteFriendship);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
