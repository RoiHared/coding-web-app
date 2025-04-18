import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    codeblock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodeBlock",
      required: true,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", SessionSchema);

export default Session;
