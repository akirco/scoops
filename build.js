const _7z = require("7zip-min");
const fs = require("fs");

function build() {
  if (fs.existsSync(`./dist/scoops`)) {
    _7z.pack(`./dist/scoops`, `scoops.7z`, (error, res) => {});
  } else {
    return;
  }
}

build();
