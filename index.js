import express from 'express';
import knex from 'knex';
import shortid from 'shortid';
const db = knex({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'shortlink'
  }
})
const app = express()
const port = 3000
app.use(express.json())
//创建短链接
app.post('/create_url',async (req,res) => {
  const short_id = shortid.generate()
  const url = req.body.url
  await db('short').insert({ short_id, url })
  res.send(`http://localhost:${port}/${short_id}`)
})
//通过短链接重定向到地址
app.get('/:short_id', async (req, res) => {
  const short_id = req.params.short_id
  const result = await db('short').select('url').where({ short_id })
  if (result.length > 0) {
    res.redirect(result[0].url)
  } else {
    res.status(404).send('Not found')
  }
})
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))