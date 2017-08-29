const Express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const app = Express();

app.get("/", async (req, res) => {
  let filepath = req.url;
  if (filepath.endsWith("/")) filepath += "index.html";
  const buffer = await readFile("./static/" + filepath);
  const content = buffer.toString();
  res.send(content);
});
app.use(Express.static("static"));
app.listen(8080);
