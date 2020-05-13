const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    userData: {
        hight: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be a postive number')
                }
            }
        },
        weight: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be a postive number')
                }
            }
        },
        sex: {
            type: String,
            default: "",
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be a postive number')
                }
            }
        },
        calories: {
            type: Number,
            default: 0,
        },
        index: {
            label: {
                type: String,
                default: '',
            },
            value: {
                type: String,
                default: '',
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]

})

userSchema.virtual('menu', {
    ref: 'Menu',
    localField: '_id',
    foreignField: 'owner'
})




userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}





userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }
    const isMath = await bcrypt.compare(password, user.password);

    if (!isMath) {
        throw new Error('Unable to login')
    }
    return user;
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
});



const User = mongoose.model('User', userSchema);

module.exports = User