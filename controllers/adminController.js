const fs = require('fs')
const path = require('path')
const Blog = require('../models/blogModel')
const Comment = require('../models/commentModel')

const getHomeAdminPanel = async (req, res) => {
   try {
      const countComment = await Comment.find().countDocuments()
      const pagelimit = 9
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const total = await Blog.countDocuments()

      //Redirect if queires [page, limit] doesn't exist
      if(req.url === '/home'){
         return res.redirect(`?page=1&limit=${pagelimit}`)
      }

      const blogs = await Blog
      .find()
      .skip((page * limit) - limit)
      .limit(limit)
      .lean()

      res.render('admin/home', {
         title: "Admin panels",
	      total,
         countComment,
         blogs: blogs.reverse(),
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(total/limit)
         }
      })
   } catch(err) {
       console.log(err)
   }
}

const getAddPage = async (req, res) => {
   res.render('addPost/add', {
      title: 'Add Post',
      isLogged: req.session.isLogged,
      fileErr: req.flash('fileErr')[0],
   })
}

const getAddPost = async (req, res) => {
   try {
      if(!req.files) {
         req.flash('fileErr', 'Fayl yuklanmagan')
         return res.redirect('/admin/add')
      }

      const image = req.files.image

      if(!image.mimetype.startsWith('image')){
	      req.flash('fileErr', 'Faqat rasm yuklashingiz mumkin')
	      return res.redirect('/admin/add')
      }

      image.name = `photo_${new Date().getTime()}${path.parse(image.name).ext}`

      image.mv(`public/uploads/${image.name}`, async err => {
         if(err) {
            console.log(err)
         }
      })

      function convertSlugText(text){
         return text.toLowerCase().
         replace(/ /g,'-')
         .replace(/[^\w-]+/g,'')
      }

      const blog = new Blog({
         title: req.body.title,
         image: `/uploads/${image.name}`,
         content: req.body.content,
         slugUrl: convertSlugText(req.body.title)
      })

      await blog.save()
      res.redirect('/admin/home')

   } catch (err) {
      console.log(err)
   }
}

const getEditPage = async (req, res) => {
   try {
      let slugUrl = req.query.post
      const blog = await Blog.findOne({slugUrl})

      res.render('edit/editPost', {
         title: blog.title,
         content: blog.content,
         image: blog.image,
         slugUrl: blog.slugUrl,
         isLogged: req.session.isLogged,
	      URL: process.env.URL
      })
   } catch(err) {
      console.log(err)
   }
}

const getEditPost = async (req, res) => {
   try {
      if(!req.files) {
         req.flash('fileErr', 'Fayl yuklanmagan')
         return res.redirect('/admin/add')
      }
      const image = req.files.image

      if(!image.mimetype.startsWith('image')){
         req.flash('fileErr', 'Faqat rasm yuklashingiz mumkin')
         return res.redirect('/admin/add')
      }
      image.name = `photo_${new Date().getTime()}${path.parse(image.name).ext}`

      image.mv(`public/uploads/${image.name}`, async err => {
         if(err) {
            console.log(err)
         }
      })
      const editBlog = {
         image: `/uploads/${image.name}`,
         title: req.body.title,
         content: req.body.content
      }
      const editedBlog = await Blog.findOne({slugUrl: req.params.slugUrl})
      const filePath = path.join(__dirname, '..', `public${editedBlog.image}`)
      fs.unlinkSync(filePath)
      const blogs = await Blog.findByIdAndUpdate(editedBlog._id, editBlog).lean()
      res.redirect('/admin/home')
   } catch(err) {
      console.log(err)
   }
}

const deletePost = async (req, res) => {
   try {
      const blog = await Blog.findById(req.params.id)
      await Blog.findByIdAndDelete(req.params.id)
      const filePath = path.join(__dirname, '..', `public${blog.image}`)
      fs.unlinkSync(filePath)
      res.redirect('/admin/home')
   } catch(err) {
      console.log(err)
   }
}

const getComments = async (req, res) => {
   try {
      const pagelimit = 30;
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const total = await Comment.countDocuments()

      if(req.url === '/comments'){
         return res.redirect(`?page=1&limit=${pagelimit}`)
      }

      const comments = await Comment
      .find()
      .skip((page * limit) - limit)
      .limit(limit)
      .lean()

      res.render('admin/comments.hbs', {
         title: 'Admin comments',
         total,
         comments: comments,
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(total/limit)
         }
      })
   } catch(err) {
      console.log(err)
   }
}

const deleteComments = async (req, res) => {
   try {
      const commentId = req.params.id
      const blog = await Blog.findOne({comments: {_id: commentId}})
      await Blog.findByIdAndUpdate(blog._id, { $pullAll: {comments: [commentId]}})
      await Comment.findByIdAndRemove(commentId)
      res.redirect('/admin/comments')
   } catch(err) {
      console.log(err)
   }
}


module.exports = {
   getHomeAdminPanel,
   getAddPage,
   getAddPost,
   getEditPage,
   getEditPost,
   deletePost,
   getComments,
   deleteComments
}
