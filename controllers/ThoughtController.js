const Thought = require('../models/Thought')
const User = require('../models/User')

const { Op, or } = require('sequelize')

module.exports = class ThoughtController{
    static async dashboard(req, res){
        const userId = req.session.userid

        const user = await User.findOne({
            where:{
                id:userId,
            },
            include: Thought,
            plain: true,
        })

        const thoughts = user.Thought.map((result) => result.dataValues)

        let emptyThoughts = true

        if(thoughts.length > 0){
            emptyThoughts = false
        }

        console.log(thoughts)
        console.log(emptyThoughts)
        
        res.render('thoughts/dashboard',{thoughts, emptyThoughts})
    }

    static showThoughts(req, res){
        console.log(req.query)

        let search=''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        }
        console.log(order)
        Thought.findAll({
            include: User,
            where:{
                title:{[Op.like]:`%${search}%`},
            },
            order:[['createdAt',order]]
        })
    }
}