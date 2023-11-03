const http = require("http");
const fs = require("fs");
const url = require("url");
const { log } = require("console");

const htmlHome = fs.readFileSync(
  `${__dirname}/template/overview.html`,
  "utf-8"
);
const htmlCard = fs.readFileSync(
  `${__dirname}/template/template-card.html`,
  "utf-8"
);
const htmlDetail = fs.readFileSync(
  `${__dirname}/template/details.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

function replaceTemplate(template, product) {
  let output = template;
  output = output.replace(/{IMGURL}/g, product.image);
  output = output.replace(/{TITLE}/g, product.title);
  output = output.replace(/{PRICE}/g, product.price);
  output = output.replace(/{ID}/g, product.id);
  output = output.replace(/{DESCRIPTION}/g, product.description);

  return output;
}

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  if (pathname === "/" || pathname === "/overview") {
    const html = dataObj.map((el) => replaceTemplate(htmlCard, el)).join("");

    let output = htmlHome.replace(/{CARD}/g, html);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(output);
  } else if (pathname === "/details/") {
    const currentProduct = dataObj.find((ele) => ele.id == query.id);
    const html = replaceTemplate(htmlDetail, currentProduct);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(html);
  } else {
    response.end("Page Not Found");
  }
});

server.listen(3000, () => {
  console.log("listening to the port");
});
