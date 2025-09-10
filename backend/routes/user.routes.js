
const express = require("express")
const { createUser, linkBvn } = require("../controller/user.controller")
const router  = express.Router()


router.post("/login", createUser)
router.post("/linkbvn", linkBvn)

module.exports = router