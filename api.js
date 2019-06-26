const express = require('express')
const nanoid = require('nanoid')
const db = require('./db.js')

const app = new express()
const port = 3300

app.use(express.json())

// Join Polls & Answers together and retrun them as json object

app.get('/api/v1/polls', async (req, res) => {
  const polls = await db.Raw(
    `select id, question, link, 
  (select json_agg(row_to_json(answers))
  from answers
  where poll_id=polls.id
  ) as answers
  from polls`
  )
  return res.send(polls.rows)
})

app.post('/api/v1/polls', async (req, res) => {
  const poll = await req.body
  const postPoll = await db
    .Polls()
    .returning('id')
    .insert({
      question: poll.question,
      link: nanoid()
    })
  poll.answers.forEach(async answer => {
    await db.Answers().insert({
      answer: answer.answer,
      poll_id: parseInt(postPoll[0])
    })
  })
  return res.status(204).send()
})

app.put('/api/v1/polls/:poll_id', async (req, res) => {
  const pollId = req.params.poll_id
  const pollData = req.body

  const poll = await db
    .Polls()
    .where('id', pollId)
    .update({ ...pollData })
  return res.status(204).send()
})

app.put('/api/v1/answers/:answer_id', async (req, res) => {
  const answerId = req.params.answer_id
  await db
    .Answers()
    .where('id', answerId)
    .increment('votes', 1)
  return res.status(204).send()
})

app.delete('/api/v1/polls/:poll_id', async (req, res) => {
  const poll_id = req.params.poll_id

  await db
    .Answers()
    .where('poll_id', poll_id)
    .delete()

  const poll = await db
    .Polls()
    .where('id', poll_id)
    .returning('id', 'question')
    .delete()

  if (poll.length < 1) return res.status(404).send()
  return res.status(201).send(poll)
})

app.listen(port, () => console.log(`api is listening on port ${port}`))

/* 
select row_to_json(t)
from (
  select id, question, link, 
  (select json_agg(row_to_json(answers))
  from answers
  where poll_id=polls.id
  ) as answers
  from polls
) t;
*/
