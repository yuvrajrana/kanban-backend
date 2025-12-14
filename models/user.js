import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  shortName: String,
  avatarColor: String,
  boards: [String] // list of board IDs
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
