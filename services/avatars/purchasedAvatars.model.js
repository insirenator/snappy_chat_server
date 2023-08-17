import mongoose from "mongoose";

const purchasedAvatarsSchema = new mongoose.Schema({
    avatarId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Avatar",
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
});

const PurchasedAvatar = mongoose.models.PurchasedAvatar || mongoose.model("PurchasedAvatar", purchasedAvatarsSchema);

export default PurchasedAvatar;