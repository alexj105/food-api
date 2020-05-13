const mongoose = require('mongoose');

const Menu = mongoose.model('Menu', {
    date: {
        type: String,
        required: true
    },
    menu: {
        type: Array,
        required: true,
    },
    totalEnergy: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },


})

module.exports = Menu