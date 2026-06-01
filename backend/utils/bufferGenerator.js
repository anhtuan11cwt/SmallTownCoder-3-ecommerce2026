import path from "node:path";
import DataURIParser from "datauri/parser.js";

const bufferGenerator = (file) => {
  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default bufferGenerator;
