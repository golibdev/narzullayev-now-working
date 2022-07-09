const fs = require('fs')
const path = require('path')
const Blog = require('../../models/blogModel')
const Comment = require('../../models/commentModel')

function convertSlugText(text){
   return text.toLowerCase().
   replace(/ /g,'-')
   .replace(/[^\w-]+/g,'')
}

// @API_URL api/v1/admin/add/post
// @METHOD POST

const addPost = async (req, res) => {
   try {
      if(!req.files) {
         return res.status(400).json({
            message: 'No files uploaded'
         })
      }

      const image = req.files.image

      if(!image.mimetype.startsWith('image')){
	      return res.status(400).json({
            message: 'Faqat rasm yuklanishi kerak'
         })
      }

      image.name = `photo_${new Date().getTime()}${path.parse(image.name).ext}`

      image.mv(`public/uploads/${image.name}`, async err => {
         if(err) {
            return res.status(500).json({
               message: 'Fayl yuklanmadi'
            })
         }
      })

      const blog = new Blog({
         title: req.body.title,
         image: `/uploads/${image.name}`,
         content: req.body.content,
         slugUrl: convertSlugText(req.body.title)
      })

      await blog.save()
      res.status(201).json({
         message: 'Successfully added'
      })

   } catch (err) {
      res.status(500).json({
         message: err.message
      })
   }
}

// @API_URL api/v1/admin/edit/post
// @METHOD POST

const editPost = async (req, res) => {
   try {
      const id = req.params.id
      const editedBlog = await Blog.findById(id)

      const editBlog = {
         image: editedBlog.image,
         title: req.body.title,
         content: req.body.content,
         slugUrl: convertSlugText(req.body.title)
      }
      await Blog.findByIdAndUpdate(id, editBlog)

      return res.status(200).json({
         message: 'Successfully edited'
      })
   } catch (err) {
      res.status(500).json({
         message: err.message
      })
   }
}

// @API_URL api/v1/admin/delete/post
// @METHOD DELETE
const deletePost = async (req, res) => {
   try {
      const id = req.params.id
      const blog = await Blog.findById(id)

      if(!blog) {
         return res.status(404).json({
            message: 'Post not found'
         })
      }

      await Blog.findByIdAndDelete(id)
      const filePath = path.join(__dirname, '..', '..' , `public${blog.image}`)
      fs.unlinkSync(filePath)

      return res.status(200).json({
         message: 'Successfully deleted'
      })
   } catch (err) {
      res.status(500).json({
         message: err.message
      })
   }
}

// @API_URL api/v1/admin/comments
// @METHOD GET
const getComments = async (req, res) => {
   try {
      const comments = await Comment.find()
      if(!comments) {
         return res.status(404).json({
            message: 'Comments not found'
         })
      }
      res.status(200).json({
         comments
      })
   } catch (err) {
      res.status(500).json({
         message: err.message
      })
   }
}

// @API_URL api/v1/admin/delete/comments/:id
// @METHOD DELETE
const deleteComment = async (req, res) => {
   try {
      const commentId = req.params.id
      await Comment.findByIdAndDelete(commentId)

      return res.status(200).json({
         message: 'Successfully deleted'
      })
   } catch (err) {
      console.log(err.message)
   }
}

module.exports = {
   addPost,
   editPost,
   deletePost,
   getComments,
   deleteComment
}
