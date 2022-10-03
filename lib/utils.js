const { PowerShell } = require("node-powershell");
const fs = require("fs");
const path = require("path");
const Table = require("cli-table");

async function initSource() {
  const res = await PowerShell.$`scoop search | ConvertTo-JSON`;
  const apps = res.raw.split("...")[1];
  fs.writeFileSync("./raw.json", apps, { encoding: "utf8" }, (err) => {
    if (err) process.exit();
    else console.log("初始化成功！");
  });
}

async function searchLocal(app) {
  const sourcePath = path.resolve(__dirname, "..", "raw.json");
  if (!fs.existsSync(sourcePath)) {
    await initSource();
  }
  const res = fs.readFileSync(sourcePath, { encoding: "utf8" });
  const result = [];
  const table = new Table({ head: ["Name", "Version", "Source"] });
  JSON.parse(res).filter((item) => {
    const regStr = app + ".*";
    const reg = new RegExp(regStr, "gi");
    if (item.Name.match(reg)) {
      result.push([item.Name, item.Version, item.Source]);
    }
  });
  table.push(...result);
  console.log(table.toString());
}

module.exports = { initSource, searchLocal };
