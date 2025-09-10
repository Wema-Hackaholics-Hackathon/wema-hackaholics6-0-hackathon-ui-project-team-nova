const express = require("express")
const { createUser, linkBvn, loginUser } = require("../controller/user.controller")
const router  = express.Router()


router.post("/auth", createUser)
router.post("/login", loginUser)
router.post("/linkbvn", linkBvn)

module.exports = router