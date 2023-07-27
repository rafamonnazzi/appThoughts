const {DataTypes} = require('sequelize')
const db = require('../db/conn')
const User = require('../models/User')

const Thought = db.define('Thoughts', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Thought.belongsTo(User) // pensamento.pertence a usuário
User.hasMany(Thought) // usuário.tem vários pensamentos

module.exports = Thought