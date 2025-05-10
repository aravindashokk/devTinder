const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type!`,
    },
}, {
    timestamps: true,
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    //Check if fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        return next(new Error("Cannot send connection request to yourself!"));
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);