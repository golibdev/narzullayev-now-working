const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
   email: {
      type: String,
      required: true
   },
   comment: {
      type: String,
      required: true
   }
})

module.exports = model('Comment', commentSchema)
