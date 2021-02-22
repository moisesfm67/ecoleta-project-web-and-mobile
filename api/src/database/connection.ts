import knex from "knex";
import path from "path";

("database/index.js");

const connection = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
});

export default connection;

//Migrations = historico do banco de dados

// create table points
// create table users
