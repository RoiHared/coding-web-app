import mongoose from "mongoose";

const CodeBlockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  templateCode: { type: String, required: true },
  solutionCode: { type: String, require: true },
});

const CodeBlock = mongoose.model("CodeBlock", CodeBlockSchema);

export default CodeBlock;
