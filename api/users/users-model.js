const db = require('../../data/dbConfig')

async function insert(user) {
    const newUserId = await db('users').insert(user)
    return findById(newUserId)
}

async function findById(userId) {
    return db('users').where('users.id', userId).first()
}

async function findByUsername(username) {
    return db('users').where('users.username', username).first()
}

module.exports = {insert, findById, findByUsername}