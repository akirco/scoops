const Table = require("cli-table");
var table = new Table({
  head: ["Rel", "Change", "By", "When"],
  colWidths: [6, 21, 25, 17],
});

table.push(
  ["v0.1", "Testing something cool", "rauchg@gmail.com", "7 minutes ago"],
  ["v0.1", "Testing something cool", "rauchg@gmail.com", "8 minutes ago"]
);
console.log(table);
console.log(table.toString());
