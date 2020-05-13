const express = require('express')
const Menu = require('../models/menu')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/menu', auth, async (req, res) => {

    try {
        const menuFind = await Menu.find({
            owner: req.user._id,
            date: req.body.date
        })
        if (menuFind.length === 1) {
            menuFind[0].totalEnergy = req.body.totalEnergy
            menuFind[0].menu = req.body.menu
            await menuFind[0].save()
            res.status(201).send(menuFind)
        }
        else {
            const menu = new Menu({
                ...req.body,
                owner: req.user._id
            })
            await menu.save()
            res.status(201).send(menu)
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/menu', auth, async (req, res) => {
    const match = {}
    if (req.query.date) {
        match.date = req.query.date;
    }


    try {
        // alternative
        await req.user.populate({
            path: 'menu',
            match
        }).execPopulate()
        res.send(req.user.menu)

        // alternative
        // const menu = await Menu.find({
        //     owner: req.user._id,
        //     date: req.query.date

        // })
        // console.log(menu)
        // res.send(menu);


    } catch (e) {
        res.status(500).send()
    }
})


router.delete('/menu', auth, async (req, res) => {

    try {
        const menu = await Menu.findOneAndDelete({
            date: req.query.date,
            owner: req.user._id
        })
        if (!menu) {
            res.status(404).send()
        }

        res.send(menu)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router