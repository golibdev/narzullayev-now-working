const Blog = require('../models/blogModel')
const quoteGenerateRandom = require('../quote/quote')
const Comment = require('../models/commentModel')
const captcha = require('nodejs-captcha')

function generateCaptcha() {
   const result = captcha()
   return result
}

let result = generateCaptcha()
let value = result.value
let source = result.image

const getLimitBlog = async (req, res) => {
   try {
      const blogs = await Blog.find().limit(6).sort({$natural: -1}).lean()
      res.render('index', {
         title: 'Home page',
         isLogged: req.session.isLogged,
         blogs: blogs
      })
   } catch(err) {
      console.log(err)
   }
}

const getAllBlog = async (req, res) => {
   try{

      const pagelimit = 9
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const total = await Blog.countDocuments()

      //Redirect if queires [page, limit] doesn't exist
      if(req.url === '/blogs'){
         return res.redirect(`?page=1&limit=${pagelimit}`)
      }

      if(req.query.search){
	const { search } = req.query
	const blogs = await Blog.searchPartial(search, (err, data) => {
		if(err) throw err
	}).lean()

	return res.status(200).render('search', {
		title: 'Search results',
		blogs: blogs.reverse(),
		querySearch: req.query.search
	})
      }

      const blogs = await Blog
      .find()
      .skip((page * limit) - limit)
      .limit(limit)
      .lean()

      res.render('allBlogs', {
         title: "Barcha postlar",
         blogs: blogs.reverse(),
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(total/limit)
         }
      })
   } catch(err){
      console.log(err)
   }
}

const getBlog = async (req, res) => {
   try {
      result = generateCaptcha()
      value = result.value
      source = result.image

      let slugUrl = req.query.post
      const blog = await Blog.findOne({slugUrl}).populate('comments').lean()

      const updateBlog = await Blog.findByIdAndUpdate(blog._id, {
         $inc: { count: 1 }
      }, {
         new: true
      })

      req.session.slug = slugUrl

      res.render('post', {
         title: blog.title,
         content: blog.content,
         image: blog.image,
         slugUrl: slugUrl,
         source: source,
	      id: blog._id,
	      createdAt: blog.createdAt,
         isLogged: req.session.isLogged,
         quote: quoteGenerateRandom(),
         count: updateBlog.count,
         comments: blog.comments.reverse(),
         captchaErr: req.flash('captchaErr')[0]
      })
   } catch(err) {
      console.log(err)
   }
}

const sendComment = async (req, res) => {
   try {
      const { email, comment, captcha } = req.body

      if(captcha !== value) {
         req.flash('captchaErr', 'The information did not match')
         result = generateCaptcha()
         value = result.value
         source = result.image
         return res.redirect(`/blogpost?post=${req.session.slug}`)
      }

      const comments = await Comment.create({
         email,
         comment
      })

      const blog = await Blog.findById(req.params.id)

      await Blog.findByIdAndUpdate(blog._id, {
         $push: { comments: comments._id }
      })

      res.redirect(`/blogpost?post=${blog.slugUrl}`)
   } catch(err) {
      console.log(err.message)
   }
}

module.exports = {
   getLimitBlog,
   getAllBlog,
   getBlog,
   sendComment
}
