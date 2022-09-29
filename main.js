"use strict";

async function search_local(args) {
  if (args.length !== 0) {
    console.log("search apps from local buckets");
    console.log(args);
  }
}

async function search_remote(args) {
  if (args.length !== 0) {
    console.log("search apps from remote buckets");
    const app = args[0].startsWith("-") ? args[1] : args[0];
  }
}

module.exports = {
  search_local,
  search_remote,
};
