const User = require('../models/userModel')

const getLogin = async (req, res) => {
   res.render('auth/login', {
      title: 'Login',
      logErr: req.flash('logErr')[0]
   })
}

const getRegister = async (req, res) => {
   res.render('auth/register', {
      title: 'Register',
      regErr: req.flash('regErr')[0]
   })
}

const getPostRegister = async (req, res) => {
   try {
      const { fullName, phone, email, password, confirmPassword } = req.body

      const userExist = await User.findOne({ email })
      if(userExist) {
         req.flash('regErr', 'Such a user is available on the site')
         return res.redirect('/auth/register')
      }

      if(password.length < 8) {
         req.flash('regErr', 'The password must be at least 8 characters long')
         return res.redirect('/auth/register')
      }

      const matchPassword = password === confirmPassword

      if(!matchPassword) {
         req.flash('regErr', 'Passwords did not match')
         return res.redirect('/auth/register')
      }

      await User.create({
         fullName,
         email,
         phone,
         password
      })

      res.redirect('/auth/login')

   } catch(err) {
      console.log(err)
   }
}

const getPostLogin = async (req, res) => {
   try {
      const { email, password } = req.body

      const userExist = await User.findOne({ email })

      if(!userExist) {
         req.flash('logErr', 'Data entered incorrectly')
         return res.redirect('/auth/login')
      }

      const matchPassword = userExist.password === password

      if(!matchPassword) {
         req.flash('logErr', 'Data entered incorrectly')
         return res.redirect('/auth/login')
      }

      req.session.user = userExist
      req.session.isLogged = true
      res.redirect('/admin/home')

   } catch(err) {
      console.log(err)
   }
}

const getLogOut = (req, res) => {
   req.session.user = undefined
   req.session.isLogged = false
   req.session.destroy()
   res.redirect('/')
}

module.exports = {
   getLogin,
   getRegister,
   getPostRegister,
   getPostLogin,
   getLogOut
}
