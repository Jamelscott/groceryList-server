const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../models')
const requiresToken = require('./requiresToken')
const user = require('../models/user')
const { json } = require('body-parser')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// GET Show all users
router.get('/', async (req, res) => {
  const foundUser = await db.User.find({})
  res.json(foundUser)
})

// POST /users/register -- CREATE a new user
router.post('/register' , async  (req, res) => {
   // create application/json parser
  try {
    // check if the user exist already -- dont allow them to sign up again
    const userCheck = await db.User.findOne({
      email: req.body.email
    })

    if (userCheck) return res.status(409).json({ msg: 'did you forget that you already signed up w that email? 🧐' })

    // hash the pass (could validate if we wanted)
    const salt = 12
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // create a user in th db
    const newUser = await db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    // create a jwt payload to send back to the client 
    const payload = {
      name: newUser.name,
      email: newUser.email,
      id: newUser.id
    }

    // sign the jwt and send it (log them in)
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

    res.json({ token })
  } catch (err) {
    console.log(err)
    res.status(503).json({ msg: 'oops server error 503 🔥😭' }) 
  }
})

// POST /users/login -- validate login credentials 
router.post('/login', async (req, res) => {
  // try to find the use in the db that is logging in
  const foundUser = await db.User.findOne({
    name: req.body.name
  })
  // if the user is not found -- return and send back a message that the user needs to sign up
  if (!foundUser || foundUser === null) return res.status(400).json({ msg: 'bad login credentials 😢, try again' })

  // check the password from the req.body again the password in the db
  const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)

  // if the provided info does not match -- send back an error message and return
  if (!matchPasswords) return res.status(400).json({ msg: 'bad login credentials 😢, try again' })

  // create a jwt payload
  const payload = {
    name: foundUser.name,
    email: foundUser.email,
    id: foundUser.id,
  }

  // sign the jwt
  const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

  // send it back
  res.json({ token })
})

// GET specific user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const foundUser = await db.User.findById(id)
    res.status(202).json(foundUser)
  } catch (err) {
    console.log(err)
    res.status(503).json({ message: "Something aint right here" })
  }
})

// POST new items to a user
router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const items = req.body
    const foundUser = await db.User.findById(id)
    // if user doesnt have items, push new items in
    const newUserData = await db.User.findOneAndUpdate({ _id: id }, {$set: { items: items } }, {new: true})
    // save the new user data
    await foundUser.save()

    res.status(202).json(newUserData)

  } catch(e) {
    console.log(e)
  }
})

// PUT update a user
router.put('/:id', async (req, res) => {
  try {
    const editUser = await db.User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    )
    const foundUsers = await db.User.find({})
    res.json(foundUsers)
  } catch (err) {
    console.log(err)
    res.status(503).json({ message: "the server is not going to do that" })
  }
})


// GET /users/auth-locked -- example of checking an jwt and not serving data unless the jwt is valid
router.get('/auth-locked', requiresToken, (req, res) => {
  // here we have acces to the user on the res.locals
  console.log('logged in user', res.locals.user)
  res.json({ msg: 'welcome to the auth locked route, congrats on geting thru the middleware 🎉' })
})

module.exports = router