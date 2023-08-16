const Thought = require('../models/Thought')
const User = require('../models/User')

const { Op } = require('sequelize')

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
        }).then((data) =>{
            let thoughtsQty = data.length

            if(thoughtsQty === 0){
                thoughtsQty = false
            }

            const thoughts = data.map((result) => result.get({plain: true}))

            res.render('thoughts/home',{thoughts, thoughtsQty, search})
        }).catch((err) => console.error(err))
    }

    static createThought(req, res){
        res.render('thoughts/create')
    }

    static createThoughtSave(req, res){
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        Thought.create(thought)
        .then(() => {
            req.flash('message','Pensamento foi criado com sucesso.')
            req.session.save(() =>{
                res.redirect('/thoughts/dashboard')
            })
        })
        .catch((err) => console.log(err))
    }

    static removeThought(req, res){
        const id = req.body.id

        Thought.destroy({where: {id:id}})
        .then(() => {
            req.flash('message','Pensamento Excluido com Sucesso.')
            req.session.save(() =>{
                res.redirect('/thoughts/dashboard')
            })
        })
        .catch((err) => console.log(err))
    }

    static updateThought(req, res){
        const id = req.params.id

        Thought.findOne({ where: {id:id}, raw: true})
        .then((thought) => {
            res.render('thoughts/edit',{thought})
        })
        .catch((err) => console.log(err))
    }
    static updateThoughtPost(req, res){
        const id = req.body.id

        const thought = {
            title: req.body.title,
            description: req.body.description
        }

        Thought.update(thought, {where:{id: id}})
        .then((thought) =>{
            req.flash('message', 'pensamento alterado com sucesso!')
            req.session.save(() =>{
                res.render('thought/dashboard')
            })
        } )

        .catch((err)=> console.error((err)))
    }
}