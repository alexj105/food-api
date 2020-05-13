const request = require('supertest')
const app = require('../src/app')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')
const User = require('../src/models/user')

beforeEach(setupDatabase)

test('should singup a new user', async () => {
    const response = await request(app).post('/user').send({
        name: "alexj105",
        email: "local@local.com",
        password: "asdf221gv2!!"
    }).expect(201)
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: "alexj105",
            email: "local@local.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('asdf221gv2!!')
})

test('should login existing user', async () => {
    let response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('should not login noneexistent user', async () => {
    await request(app).post('/user/login').send({
        email: "noneexistent@local.com",
        password: "asdf221gv2!!"
    }).expect(400)
})



test('should get profile for user', async () => {
    await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthonticated user', async () => {
    await request(app)
        .get('/user/me')
        .send()
        .expect(401)
})



test('should delete profile for user', async () => {
    await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete profile for unauthonticated user', async () => {
    await request(app)
        .delete('/user/me')
        .send()
        .expect(401)
})

test('should upddate user', async () => {
    await request(app)
        .patch('/user/update')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            userData: {
                hight: 2,
                weight: 4,
                sex: "male",
                age: 3,
                calories: 465,
                index: {
                    label: "111",
                    value: "5"
                }
            }
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.userData.index.value).toEqual('5')
})

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/user/update')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name:'Ivan'
        })
        .expect(400)
})