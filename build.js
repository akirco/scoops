const _7z = require("7zip-min");
const fs = require("fs");
const { PowerShell } = require("node-powershell");

async function build() {
  if (fs.existsSync(`./dist/scoops`)) {
    await _7z.pack(`./dist/scoops`, `scoops.7z`, (error, res) => {
      gethash();
    });
  } else {
    return;
  }
}
async function gethash() {
  const res = await PowerShell.$`get-filehash .\\scoops.7z | ConvertTo-JSON`;
  console.log(`Hash:` + JSON.parse(res.raw).Hash);
}

build();
