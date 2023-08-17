import Message from "./messages.model.js";

export const getMessages = async (req, res, next) => {
    try {
        const {from, to} = req.query;

        const messages = await Message.find({
            users: {
                $all : [from, to],
            },
        }).sort({ updatedAt: 1});

        // Sanitizing the messages based on who sent it
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                timestamp: msg.createdAt,
            };
        });

        res.status(200).json({status: true, data: projectedMessages});

    } catch (error) {
        next(error)
    }
}

export const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: { text: message},
            users: [from, to],
            sender: from,
        });

        if(data)
            return res.status(200).json({status: true, msg: "Message added successfully.", data,})
        else
            return res.status(500).json({status: false, msg: "Failed to add message."})
    } catch (error) {
        next(error)
    }
}