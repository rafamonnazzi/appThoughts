const express = require("express")
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', ThoughtController.dashboard)