const { PowerShell } = require("node-powershell");
const fs = require("fs");
const path = require("path");
const Table = require("cli-table");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const APP_URL = "https://scoopsearch.search.windows.net/indexes/apps/docs";
const APP_KEY = "78CB5DCD0A7ABACE5B4DC3C34BC54C8F";

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

async function searchRemote(app) {
  const url = `${APP_URL}/search?api-version=2020-06-30`;
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      count: true,
      search: app.trim(),
      searchMode: "all",
      filter: "",
      orderby:
        "search.score() desc, Metadata/OfficialRepositoryNumber desc, NameSortable asc",
      skip: 0,
      top: 20,
      select: [
        "Id",
        "Name",
        "NamePartial",
        "NameSuffix",
        "Description",
        "Homepage",
        "License",
        "Version",
        "Metadata/Repository",
        "Metadata/FilePath",
        "Metadata/AuthorName",
        "Metadata/OfficialRepository",
        "Metadata/RepositoryStars",
        "Metadata/Committed",
        "Metadata/Sha",
      ].join(","),
      highlight: [
        "Name",
        "NamePartial",
        "NameSuffix",
        "Description",
        "Version",
        "License",
        "Metadata/Repository",
        "Metadata/AuthorName",
      ].join(","),
      highlightPreTag: "<mark>",
      highlightPostTag: "</mark>",
    }),
    headers: {
      "api-key": APP_KEY,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const result = [];
      const table = new Table({
        head: ["Name", "Version", "Source", "Install"],
      });
      const resultArrary = data.value;
      resultArrary.forEach((item) => {
        const { Name, Homepage, Version, Metadata } = item;
        const { Repository, FilePath } = Metadata;
        const outputInfo = [
          Name,
          Version,
          `scoop bucket add ${Repository}`,
          `scoop install ${FilePath.split("/")[1].split(".")[0]}`,
        ];
        result.push(outputInfo);
      });
      table.push(...result);
      console.log(table.toString());
    })
    .catch((error) => {});
}

module.exports = { initSource, searchLocal, searchRemote };
