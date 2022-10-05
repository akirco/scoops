"use strict";
const { searchLocal, searchRemote } = require("./lib/utils");

function search_local(args) {
  if (args.length !== 0) {
    const app = args[0].startsWith("-") ? args[1].trim() : args[0].trim();
    searchLocal(app);
  }
}

async function search_remote(args) {
  if (args.length !== 0) {
    const app = args[0].startsWith("-") ? args[1].trim() : args[0].trim();
    const count =
      parseFloat(args[2]).toString() !== "NaN" ? parseFloat(args[2]) : 20;

    searchRemote(app, count);
  }
}

module.exports = {
  search_local,
  search_remote,
};
