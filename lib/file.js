const { PowerShell } = require("node-powershell");
const fs = require("fs");

async function initSource() {
  const res = await PowerShell.$`scoop search | ConvertTo-JSON`;
  const apps = res.raw.split("...")[1];
  fs.writeFile("./raw.json", apps, { encoding: "utf8" }, (err) => {
    if (err) process.exit();
    else console.log("初始化成功！");
  });
}

async function search(app) {
  const res = fs.readFileSync("./raw.json", { encoding: "utf8" });
  JSON.parse(res).filter((item) => {
    // console.log(item.Name);
    if (item.Name === app) {
      return item;
    }
  });
}
search("webhook");
module.exports = { initSource };
