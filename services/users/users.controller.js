import bcrypt from "bcrypt";
import User from "./users.model.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res
        .status(403)
        .json({ msg: "Username already taken", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res
        .status(403)
        .json({ msg: "Email already registered", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    delete user.password;
    return res.status(201).json({ status: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ status: false, msg: "Invalid Username" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ status: false, msg: "Incorrect Password" });

    return res.status(200).json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { avatarImage } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ status: false, msg: "user mot found" });

    user.avatarImage = avatarImage;
    user.isAvatarImageSet = true;

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, user, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ status: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const contacts = await User.find({ _id: { $ne: userId } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    return res.status(200).json({ status: true, data: contacts });
  } catch (error) {
    next(error);
  }
};
