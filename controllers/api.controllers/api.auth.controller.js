const { v4 } = require('uuid')

exports.login = async (req, res) => {
   try {
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD,
         adminUsername = process.env.DEFAULT_ADMIN_LOGIN

      const token = v4()

      const {
         password,
         username
      } = req.body

      if(password !== adminPassword || username !== adminUsername) {
         return res.status(401).json({ message: "Parol yoki username xato, qayta uruning!" })
      }

      const users = {
         username,
         token
      }

      res.status(200).json({ message: "Muvaffaqqiyatli kirildi", users })
   } catch (err) {
      res.status(501).json({ err: err.message })
   }
}