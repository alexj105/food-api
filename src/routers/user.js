const express = require('express')
const User = require('../models/user.js')
const router = new express.Router()
const auth = require('../middleware/auth')

//registration
router.post('/user', async (req, res) => {

    const user = new User(req.body)
    const token = await user.generateAuthToken()
    try {

        const token = await user.generateAuthToken()

        await user.save()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.errmsg)
    }
})
//login
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})


//auth
router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})


//update user data
router.patch('/user/update', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['userData']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) =>
            req.user[update] = req.body[update]
        )
        await req.user.save();
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//logout
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//delete
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router