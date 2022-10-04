"use strict";
const { searchLocal, searchRemote } = require("./lib/utils");

function search_local(args) {
  if (args.length !== 0) {
    const app = args[0].startsWith("-") ? args[1] : args[0];
    searchLocal(app);
  }
}

async function search_remote(args) {
  if (args.length !== 0) {
    const app = args[0].startsWith("-") ? args[1] : args[0];
    searchRemote(app);
  }
}

module.exports = {
  search_local,
  search_remote,
};
