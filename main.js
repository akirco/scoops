"use strict";
const { searchLocal } = require("./lib/utils");
function search_local(args) {
  if (args.length !== 0) {
    const app = args[0].startsWith("-") ? args[1] : args[0];
    searchLocal(app);
  }
}

async function search_remote(args) {
  if (args.length !== 0) {
    console.log("search apps from remote buckets");
    const app = args[0].startsWith("-") ? args[1] : args[0];
    console.log(app);
  }
}

module.exports = {
  search_local,
  search_remote,
};
