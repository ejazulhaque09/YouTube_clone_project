const Comment = require("../Models/comment");


//Add comment
exports.addComment = async (req, res) => {
  try {
    let { video, message } = req.body;
    const comment = new Comment({
      user: req.user._id,   //extracted from authenticated users's token
      video,
      message,
    });
    await comment.save();
    res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Retrive comment using video id
exports.getCommentByVideoId = async (req, res) => {
  try {
    let { videoId } = req.params;  // extract id from request parameters
    const comment = await Comment.find({ video: videoId }).populate(     
      "user",
      "channelName profilePic email createdAt about"
    );
    res.status(200).json({
      msg: true,
      comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.editComment = async (req, res) => {
  const { videoId } = req.params;
  const { message } = req.body;

  try {
    const comment = await Comment.findById(videoId).populate(   // populate user details
      "user",
      "channelName profilePic email createdAt about"
    );
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    comment.message = message;  // updates the comment message
    await comment.save();
    res.status(200).json({
      msg: "Comment updated",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { videoId } = req.params;

  try {
    const comment = await Comment.findById(videoId).populate(
      "user",
      "channelName profilePic email createdAt about"
    );
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    await comment.deleteOne({ _id: videoId });  // delete the comment from database
    res.status(200).json({
      msg: "Comment deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
