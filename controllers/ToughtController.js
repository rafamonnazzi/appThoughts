const thought = require('../models/thought')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ToughController {
  static async dashboard(req, res) {
    const userId = req.session.userid

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: thought,
      plain: true,
    })

    const thoughts = user.thoughts.map((result) => result.dataValues)

    let emptythoughts = true

    if (thoughts.length > 0) {
      emptythoughts = false
    }

    console.log(thoughts)
    console.log(emptythoughts)

    res.render('thoughts/dashboard', { thoughts, emptythoughts })
  }

  static createthought(req, res) {
    res.render('thoughts/create')
  }

  static createthoughtSave(req, res) {
    const thought = {
      title: req.body.title,
      UserId: req.session.userid,
    }

    thought.create(thought)
      .then(() => {
        req.flash('message', 'Pensamento criado com sucesso!')
        req.session.save(() => {
          res.redirect('/thoughts/dashboard')
        })
      })
      .catch((err) => console.log())
  }

  static showthoughts(req, res) {
    console.log(req.query)

    // check if user is searching
    let search = ''

    if (req.query.search) {
      search = req.query.search
    }

    // order results, newest first
    let order = 'DESC'

    if (req.query.order === 'old') {
      order = 'ASC'
    } else {
      order = 'DESC'
    }

    thought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]],
    })
      .then((data) => {
        let thoughtsQty = data.length

        if (thoughtsQty === 0) {
          thoughtsQty = false
        }

        const thoughts = data.map((result) => result.get({ plain: true }))

        res.render('thoughts/home', { thoughts, thoughtsQty, search })
      })
      .catch((err) => console.log(err))
  }

  static removethought(req, res) {
    const id = req.body.id

    thought.destroy({ where: { id: id } })
      .then(() => {
        req.flash('message', 'Pensamento removido com sucesso!')
        req.session.save(() => {
          res.redirect('/thoughts/dashboard')
        })
      })
      .catch((err) => console.log())
  }

  static updatethought(req, res) {
    const id = req.params.id

    thought.findOne({ where: { id: id }, raw: true })
      .then((thought) => {
        res.render('thoughts/edit', { thought })
      })
      .catch((err) => console.log())
  }

  static updatethoughtPost(req, res) {
    const id = req.body.id

    const thought = {
      title: req.body.title,
      description: req.body.description,
    }

    thought.update(thought, { where: { id: id } })
      .then(() => {
        req.flash('message', 'Pensamento atualizado com sucesso!')
        req.session.save(() => {
          res.redirect('/thoughts/dashboard')
        })
      })
      .catch((err) => console.log())
  }
}
