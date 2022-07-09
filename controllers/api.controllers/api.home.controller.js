const Blog = require('../../models/blogModel')
const quoteGenerateRandom = require('../../quote/quote')
const Comment = require('../../models/commentModel')

// @API_URl api/v1/posts
// @METHOD GET
const getAllBlogs = async (req, res) => {
   try {
      const blogs = await Blog.find()
      const countComments = await Comment.countDocuments()
      if(blogs.length === 0){
         return res.status(404).json({
            message: 'No blogs found'
         })
      }
      res.status(200).json({
         blogs: blogs,
         countComments: countComments,
         message: 'Success'
      })
   } catch(err) {
      res.status(500).json({
         message: err.message
      })
   }
}

// @API_URL  api/v1/home/post/:slug
// @Method GET
const getOneBlog = async (req, res) => {
   try {
      const slugUrl = req.params.slug
      const blog = await Blog.findOne({slugUrl}).populate('comments')

      if(!blog) {
         return res.status(404).json({
            message: 'Blog not found'
         })
      }

      await Blog.findByIdAndUpdate(blog._id, {
         $inc: { count: 1 }
      }, {
         new: true
      })

      res.status(200).json({
         blog: blog,
         message: 'Success',
         quote: quoteGenerateRandom()
      })
   } catch (err) {
      res.status(500).json({
         message: err.message
      })
   }
}

// @API_URL api/v1/home/comment/:id
// @METHOD POST
const sendComment = async (req, res) => {
   try {
      const { email, comment } = req.body
      const comments = await Comment.create({
         email,
         comment
      })
      const blog = await Blog.findById(req.params.id)

      if(!blog) {
         return res.status(404).json({
            message: 'Blog not found'
         })
      }

      await Blog.findByIdAndUpdate(blog._id, {
         $push: { comments: comments._id }
      })

      res.status(200).json({
         message: 'Success'
      })
   } catch(err) {
      res.status(500).json({
         message: err.message
      })
   }
}

module.exports = {
   getAllBlogs,
   getOneBlog,
   sendComment
}