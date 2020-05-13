const User = require('../../src/models/user')
const Menu = require('../../src/models/menu')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const userOneId = mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "tom",
    email: "tom@local.com",
    password: "asdf221gv2!!",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}


const menuOne = {
    _id: new mongoose.Types.ObjectId(),
    menu: [1, 5, 3],
    date: "2017-12-12",
    totalEnergy: 5,
    owner: userOne._id
}






const setupDatabase = async () => {
    await User.deleteMany()
    await Menu.deleteMany()
    await new User(userOne).save()
    await new Menu(menuOne).save()
}

module.exports = {
    userOneId,
    userOne,
    menuOne,
    setupDatabase
}