const Express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const im = require("gm").subClass({ imageMagick: true });
const app = Express();

app.get("/", async (req, res) => {
  let filepath = req.url;
  if (filepath.endsWith("/")) filepath += "index.html";
  const buffer = await readFile("./static/" + filepath);
  const content = buffer.toString();
  const newContent = content.split(/(<sc-img[^>]+><\/sc-img>)/).map(item => {
    if (!item.startsWith("<sc-img")) return item;
    const src = /src="([^"]+)"/.exec(item)[1];
    const img = im("./static/" + src);
    console.log(img);
    return item;
  });
  res.send(newContent.join(""));
});
app.use(Express.static("static"));
app.listen(8080);
