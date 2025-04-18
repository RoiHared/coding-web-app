import CodeBlock from "../models/codeBlockModel.js";

export const getCodeblocks = async (req, res) => {
  try {
    const codeblocks = await CodeBlock.find({});
    res.status(200).json(codeblocks);
  } catch (error) {
    console.error("Error fetching code blocks:", error.message);
    res.status(500).json({ message: "Failed to fetch code blocks" });
  }
};

export const getCodeblockById = async (req, res) => {
  try {
    const codeblock = await CodeBlock.findById(req.params.roomId);
    if (!codeblock) {
      return res.status(404).json({ message: "Code block not found" });
    }
    res.status(200).json(codeblock);
  } catch (error) {
    console.error("Error fetching code block by ID:", error.message);
    res.status(500).json({ message: "Failed to fetch code block" });
  }
};
