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

knex.schema.hasTable('polls').then(exists => {
  if (!exists) {
    return knex.schema
      .createTable('polls', t => {
        t.increments('id')
        t.string('question').notNullable()
        t.string('link').notNullable()
        t.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6))
      })
      .then(() => console.log('table created'))
      .catch(err => {
        console.log(err)
        throw err
      })
  }
})

knex.schema.hasTable('answers').then(exists => {
  if (!exists) {
    return knex.schema
      .createTable('answers', t => {
        t.increments()
        t.string('answer').notNullable()
        t.integer('votes').defaultTo(0)
        t.integer('poll_id')
          .unsigned()
          .notNullable()
        t.foreign('poll_id').references('polls.id')
      })
      .then(() => console.log('table created'))
      .catch(err => {
        console.log(err)
        throw err
      })
  }
})

// knex
//   .select('*')
//   .from('answers')
//   .then(data => console.log(data))

// knex('polls')
//   .insert([
//     { question: 'How do you like your coffee', link: nanoid() },
//     { question: 'What is your favorite soda', link: nanoid() },
//     { question: 'Whats the best Genre of music', link: nanoid() }
//   ])
//   .then(() => console.log('polls created'))

// knex('answers')
//   .insert([
//     { answer: 'black', poll_id: 1, votes: 10 },
//     { answer: 'cream & sugar', poll_id: 1 },
//     { answer: 'pepsi', poll_id: 2 },
//     { answer: 'coke', poll_id: 2 },
//     { answer: 'rap', poll_id: 3 },
//     { answer: 'rock', poll_id: 3 },
//     { answer: 'country', poll_id: 3 }
//   ])
//   .then(() => console.log('answers created'))

// knex.schema
//   .dropTable('answers')
//   .dropTable('polls')
//   .then(() => console.log('tables deleted'))

// polls
//   id
//   question
//   link
//   ts

// answers
//   id
//   answer
//   votes
//   poll_id
