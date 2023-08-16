const express = require("express")
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')

const checkAuth = require('../helpers/auth').checkAuth
router.get('/add', checkAuth, ThoughtController.createThought)
router.post('/add', checkAuth, ThoughtController.createThoughtSave)
router.post('/remove', checkAuth, ThoughtController.removeThought)
router.get('/edit/:id' , checkAuth, ThoughtController.updateThought)
router.get('/edit', checkAuth, ThoughtController.updateThoughtPost)
router.get('/dashboard', ThoughtController.dashboard)
router.get('/', ThoughtController.showThoughts)

module.exports = router