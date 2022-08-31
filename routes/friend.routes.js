const router = require("express").Router();

const Friendship = require("../models/Friendship.model");

//send friendship request
router.post("/:requestedId", async (req, res, next) => {
  try {
    const { requestedId } = req.params;
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

//accept friendship request
router.patch("/:friendshipId", async (req, res, next) => {
  try {
    const { friendshipId } = req.params;
    const { answer } = req.body;
    const friendshipRequest = await Friendship.findById(friendshipId);
    if (friendshipRequest.requested.toString() !== req.user.id) {
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
      friendshipRequest.status = "accepted";
      return res.status(201).json(friendshipRequest);
    } else if (answer === "no") {
      friendshipRequest.status = "declined";
      const deletedRequest = await Friendship.findByIdAndDelete(friendshipId);
      return res.status(201).json(deletedRequest);
    }
  } catch (error) {
    next(error);
  }
});

// display user friends
router.get("/", async (req, res, next) => {
  try {
    const allMyFriends = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
      status: "accepted",
    });
    return res.status(200).json(allMyFriends);
  } catch (error) {
    next(error);
  }
});

// find user by name
router.get("/searchbyname", async (req, res, next) => {
  try {
    const { name } = req.body;
    const allMyFriendships = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
      status: "accepted",
    }).populate("requested");
    const arrFriends = [];
    for (let friendship of allMyFriendships) {
      if (friendship.requested.name === name) {
        arrFriends.push(friendship.requested);
      } else if (friendship.requestor.name === name) {
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
      friendshipId.requestor.toString() === req.user.id ||
      friendshipId.requested.toString() === req.user.id
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
