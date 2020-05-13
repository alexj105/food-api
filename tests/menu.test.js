const request = require('supertest')
const app = require('../src/app')
const { userOneId, menuOne, userOne, setupDatabase } = require('./fixtures/db')
const Menu = require('../src/models/menu')

beforeEach(setupDatabase)

test(' should create  menu for user', async () => {
    const response = await request(app)
        .post('/menu')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            menu: [1, 2, 3],
            date: "2012-12-12",
            totalEnergy: 505
        })
        .expect(201)
    const menu = await Menu.findById(response.body._id)
    expect(menu).not.toBeNull()
    expect(menu.totalEnergy).toEqual(505)
})

test('create invalid new menu', async () => {
    await request(app)
        .post('/menu')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        })
        .expect(400)
})

test('get all menu', async () => {
    let response = await request(app)
        .get('/menu')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body).not.toBeNull()
})


test('get all menu without auth', async () => {
    let response = await request(app)
        .get('/menu')
        .send()
        .expect(401)
})

test('delete menu by date', async () => {
    const  response = await request(app)
        .delete(`/menu?date=${menuOne.date}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const menu = await Menu.findById(response.body._id)
    expect(response.body).not.toBeNull()
})


