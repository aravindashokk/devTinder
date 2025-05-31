const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

const inititalizeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        //Handle events
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const room = getSecretRoomId({ userId, targetUserId });
            // console.log(`${firstName} joined room: ${room}`);
            socket.join(room);
        });
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
            try {
                const room = getSecretRoomId({ userId, targetUserId });
                // console.log(`${firstName} sent a message to room: ${text}`);

                const existingConnectionRequest = await ConnectionRequest.findOne({
                    status: "accepted" ,
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, },
                        { fromUserId: targetUserId, toUserId: userId }
                    ]
                })

                if (!existingConnectionRequest) {
                    console.log("No connection request found between users");
                    throw new Error("No connection request found between users");

                }


                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },
                });
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                });

                await chat.save();

                io.to(room).emit('messageReceived', {
                    firstName,
                    lastName,
                    text,
                });

            } catch (err) {
                console.log("Error in sending message: ", err);
            }


        });
        socket.on("disconnect", () => {

        });

    });
};

module.exports = inititalizeSocket;