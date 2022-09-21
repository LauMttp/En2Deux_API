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

//display friendship requests sent and receive on "pending" status 
router.get("/invitations", async (req, res, next) => {
  try {
    const addRequests = await Friendship.find({
      $or: [{ requested: req.user.id}, { requestor: req.user.id }],
      status: "pending"
    }).populate("requestor requested");
    console.log(addRequests)
    return res.status(200).json(addRequests);
  } catch (error) {
    next(error);
  }
})

// display user friends
router.get("/", async (req, res, next) => {
  try {
    const allMyFriends = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
      status: "accepted",
    }).populate("requested requestor")
    // const finalArray = allMyFriends.map(friend => {
    //   if(friend.requested === req.user.id) {
    //     console.log(friend.populate("requestor"))
    //     return await friend.populate("requestor");
    //   }else{
    //     console.log(friend.populate("requested"))
    //     return await friend.populate("requested")
    //   }
    // })

    return res.status(200).json(allMyFriends);
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

// find user by name
router.get("/search", async (req, res, next) => {
  try {
    const { username } = req.query;
    const allMyFriendships = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
      status: "accepted",
    }).populate("requested requestor");
    console.log(allMyFriendships)
    const arrFriends = [];
    for (let friendship of allMyFriendships) {
      if (friendship.requested.username === username) {
        arrFriends.push(friendship.requested);
      } else if (friendship.requestor.username === username) {
        arrFriends.push(friendship.requestor);
      }
    }
    // vérifier status ++ ajouter recherche by user name
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
