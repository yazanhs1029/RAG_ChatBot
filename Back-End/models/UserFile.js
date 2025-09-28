import mongoose from "mongoose";

const EmbeddedFileTextSchema = new mongoose.Schema({
  embedding: {
    type: [Number],
    required: true,
  },
  chunk: {
    type: String,
    required: true,
  },
});

const EmbeddedFileTextModel = mongoose.model(
  "EmbeddedFileText",
  EmbeddedFileTextSchema
);

export default EmbeddedFileTextModel;
