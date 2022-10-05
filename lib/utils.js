const { PowerShell } = require("node-powershell");
const fs = require("fs");
const path = require("path");
const Table = require("cli-table");
const fetch = require("cross-fetch");
const APP_URL = "https://scoopsearch.search.windows.net/indexes/apps/docs";
const APP_KEY = "78CB5DCD0A7ABACE5B4DC3C34BC54C8F";

async function initSource() {
  const res = await PowerShell.$`scoop search | ConvertTo-JSON`;
  const apps = res.raw.split("...")[1];
  const sourcePath = path.join(process.execPath, "..", "raw.json");
  fs.writeFileSync(sourcePath, apps, { encoding: "utf8" }, (err) => {
    if (err) process.exit();
    else console.log("初始化成功！");
  });
}

async function searchLocal(app) {
  const sourcePath = path.join(process.execPath, "..", "raw.json");
  // const sourcePath = path.resolve(__dirname, "..", "raw.json");
  if (!fs.existsSync(sourcePath)) {
    await initSource();
  }
  const res = fs.readFileSync(sourcePath, { encoding: "utf8" });
  const result = [];
  const table = new Table({ head: ["Name", "Version", "Source"] });
  JSON.parse(res).filter((item) => {
    const regStr = app + ".*";
    const reg = new RegExp(regStr, "gi");
    if (item && item.Name.match(reg)) {
      if (item.Name && item.Version && item.Source) {
        result.push([item.Name, item.Version, item.Source]);
      }
    }
  });
  table.push(...result);
  console.log(`Search result:${table.length}`);
  if (table.length !== 0) {
    console.log(table.toString());
  }
}

async function searchRemote(app, count) {
  const url = `${APP_URL}/search?api-version=2020-06-30`;
  const result = [];
  const searchRes = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      count: true,
      search: app.trim(),
      searchMode: "all",
      filter: "",
      orderby:
        "search.score() desc, Metadata/OfficialRepositoryNumber desc, NameSortable asc",
      skip: 0,
      top: count,
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
  });
  const jsonData = await searchRes.json();
  const table = new Table({
    head: ["Name", "Version", "Source"],
  });
  jsonData.value.forEach((item) => {
    const { Name, Version, Metadata } = item;
    const { Repository, FilePath } = Metadata;
    let outputInfo;
    if (FilePath.startsWith("bucket") && Name && Version && Repository) {
      outputInfo = [Name, Version, Repository];
      result.push(outputInfo);
    }
  });
  table.push(...result);
  console.log(`Search result:${table.length}`);
  if (table.length !== 0) {
    console.log(table.toString());
  }
}

module.exports = { initSource, searchLocal, searchRemote };
