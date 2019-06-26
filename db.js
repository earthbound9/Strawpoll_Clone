require('dotenv').config()

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
  }
})

const db = {
  Raw: value => knex.raw(value),
  Polls: () => knex('polls'),
  Answers: () => knex('answers')
}

module.exports = db
