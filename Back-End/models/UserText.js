import mongoose from "mongoose";

const UserInput = mongoose.Schema({
  Embedding: { type: [Number], required: true },
  chunk: { type: string, required: true },
});
const UserTextModel = mongoose.model("UserText", UserInput);

export default UserTextModel;
