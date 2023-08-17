import mongoose from "mongoose";

const avatarSchema = new mongoose.Schema({
    image: {
        type:String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        default: 0,
    }
});

const Avatar = mongoose.models.Avatar || mongoose.model("Avatar", avatarSchema);

export default Avatar;