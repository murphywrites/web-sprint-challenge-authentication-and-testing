const server = require('./server')
const db = require('../data/dbConfig')
const request = require('supertest')


// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
// beforeEach(async () => {
//   await db('users').truncate()
// })

afterAll(async () => {
  await db.destroy()
  // done()
})


describe('server.js', () => {
  describe('1 [POST] /api/auth/register', () => {
    it('can register a user', async () => {
      let res = await request(server).post('/api/auth/register').send({username:"foo", password:"bar"})
      expect(res.body.username).toBe("foo")
      //expect(res.body.id).toEqual(expect.any(Number))
    }, 500)
    it('changes the registered users password', async () => {
      let res = await request(server).post('/api/auth/register').send({username:"foo2", password:"bar"})
      expect(res.body.password).not.toBe("bar")
      //expect(res.body.id).toEqual(expect.any(Number))
    }, 500)
  })

  describe('2 [POST] /api/auth/login', () => {
    it('return a 200', async () => {
      let res = await request(server).post('/api/auth/login').send({username:"foo2", password:"bar"})
      expect(res.status).toBe(200)
      //expect(res.body.id).toEqual(expect.any(Number))
    }, 500)
    it('sends the expected welcome message', async () => {
      let res = await request(server).post('/api/auth/login').send({username:"foo2", password:"bar"})
      expect(res.body.message).toBe("welcome foo2")
    }, 500)
  })
  describe('3 [GET] /api/jokes', () => {
    it('responds with a 401 if not logged in', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    }, 500)
  })

  describe('3 [GET] /api/jokes', () => {
    it('responds with a 200 if logged in', async () => {
      let res1 = await request(server).post('/api/auth/login').send({username:"foo2", password:"bar"})
      
      const res2 = await request(server).get('/api/jokes').set({ Authorization: res1.body.token })
      expect(res2.body).toHaveLength(3)
    }, 500)
  })
    // it('responds with a new post', async () => {
    //   let res = await request(server).post('/api/posts').send(post1)
    //   expect(res.body).toHaveProperty('id')
    //   expect(res.body).toMatchObject(post1)
    //   res = await request(server).post('/api/posts').send(post2)
    //   expect(res.body).toHaveProperty('id')
    //   expect(res.body).toMatchObject(post2)
    // }, 500)
//     it('on missing title or contents responds with a 400', async () => {
//       let res = await request(server).post('/api/posts').send({ title: 'foo' })
//       expect(res.status).toBe(400)
//       res = await request(server).post('/api/posts').send({ contents: 'bar' })
//       expect(res.status).toBe(400)
//     }, 500)
//   })
//   describe('4 [PUT] /api/posts/:id', () => {
//     it('responds with updated user', async () => {
//       const [id] = await db('posts').insert(post1)
//       const updates = { title: 'xxx', contents: 'yyy' }
//       const res = await request(server).put(`/api/posts/${id}`).send(updates)
//       expect(res.body).toMatchObject({ id, ...updates })
//     }, 500)
//     it('saves the updated user to the db', async () => {
//       const [id] = await db('posts').insert(post2)
//       const updates = { title: 'aaa', contents: 'bbb' }
//       await request(server).put(`/api/posts/${id}`).send(updates)
//       let user = await db('posts').where({ id }).first()
//       expect(user).toMatchObject({ id, ...updates })
//     }, 500)
//     it('responds with the correct message & status code on bad id', async () => {
//       const updates = { title: 'xxx', contents: 'yyy' }
//       const res = await request(server).put('/api/posts/foobar').send(updates)
//       expect(res.status).toBe(404)
//       expect(res.body.message).toMatch(/does not exist/i)
//     }, 500)
//     it('responds with the correct message & status code on validation problem', async () => {
//       const [id] = await db('posts').insert(post2)
//       let updates = { title: 'xxx' }
//       let res = await request(server).put(`/api/posts/${id}`).send(updates)
//       expect(res.status).toBe(400)
//       expect(res.body.message).toMatch(/provide title and contents/i)
//       updates = { contents: 'zzz' }
//       res = await request(server).put(`/api/posts/${id}`).send(updates)
//       expect(res.status).toBe(400)
//       expect(res.body.message).toMatch(/provide title and contents/i)
//       updates = {}
//       res = await request(server).put(`/api/posts/${id}`).send(updates)
//       expect(res.status).toBe(400)
//       expect(res.body.message).toMatch(/provide title and contents/i)
//     }, 500)
//   })
//   describe('5 [DELETE] /api/posts/:id', () => {
//     it('reponds with a 404 if the post is not found', async () => {
//       let res = await request(server).delete('/api/posts/111')
//       expect(res.status).toBe(404)
//       expect(res.body.message).toMatch(/does not exist/i)
//     }, 500)
//     it('reponds with the complete deleted post', async () => {
//       await db('posts').insert(post1)
//       let res = await request(server).delete('/api/posts/1')
//       expect(res.body).toHaveProperty('id')
//       expect(res.body).toMatchObject(post1)
//     }, 500)
//     it('removes the deleted post from the database', async () => {
//       const [id] = await db('posts').insert(post2)
//       let post = await db('posts').where({ id }).first()
//       expect(post).toBeTruthy()
//       await request(server).delete('/api/posts/' + id)
//       post = await db('posts').where({ id }).first()
//       expect(post).toBeFalsy()
//     }, 500)
//   })
//   describe('6 [GET] /api/posts/:id/messages', () => {
//     it('reponds with a 404 if the post is not found', async () => {
//       let res = await request(server).get('/api/posts/66/comments')
//       expect(res.status).toBe(404)
//       expect(res.body.message).toMatch(/does not exist/i)
//     }, 500)
//     it('can get all the messages associated to the posts with given id', async () => {
//       await db('posts').insert(post1)
//       await db('posts').insert(post2)
//       const messages = [
//         { text: 'foo', post_id: 1 }, { text: 'bar', post_id: 1 }, { text: 'baz', post_id: 2 }
//       ]
//       await db('comments').insert(messages)
//       let res = await request(server).get('/api/posts/1/comments')
//       expect(res.body).toHaveLength(2)
//       expect(res.body).toMatchObject([messages[0], messages[1]])
//       res = await request(server).get('/api/posts/2/comments')
//       expect(res.body).toHaveLength(1)
//       expect(res.body).toMatchObject([messages[2]])
//     }, 500)
//   })
})
