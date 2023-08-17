import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    message : {
        text: { type: String, required: true},
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true});

const Message = mongoose.models.Message || mongoose.model("Message", msgSchema);

export default Message;