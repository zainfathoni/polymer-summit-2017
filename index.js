const Express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const im = require("gm").subClass({ imageMagick: true });
const app = Express();

const thumbSize = 16;

app.get("/", async (req, res) => {
  let filepath = req.url;
  if (filepath.endsWith("/")) filepath += "index.html";
  const buffer = await readFile("./static/" + filepath);
  const content = buffer.toString();
  const newContent = await Promise.all(
    content.split(/(<sc-img[^>]+><\/sc-img>)/).map(async item => {
      if (!item.startsWith("<sc-img")) return item;
      const src = /src="([^"]+)"/.exec(item)[1];
      const img = im("./static/" + src);
      const sizeFunc = promisify(img.size.bind(img));
      const { width, height } = await sizeFunc();
      const thumbFunc = promisify(
        img.resize(thumbSize, thumbSize).toBuffer.bind(img)
      );
      const thumb = await thumbFunc("PNG");
      const thumbURL = `data:image/png;base64,${thumb.toString("base64")}`;
      return item.replace(
        `></sc-img>`,
        `style="padding-top: ${height /
          width *
          100}%; background-image: url(${thumbURL});"></sc-img>`
      );
    })
  );
  res.send(newContent.join(""));
});
app.use(Express.static("static"));
app.listen(8080);
