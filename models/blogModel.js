const { Schema, model } = require('mongoose')

const postSchema = Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        min: 15,
        max: 100
    },
    image: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        min: 10,
        max: 1000000
    },
    slugUrl: {
        type: String,
        unique: true
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

postSchema.index({
	title: "text",
	content: "text"
})

postSchema.statics = {
	searchPartial: function(q, callback){
		return this.find({
			$or: [
				{ "title": new RegExp(q, "gi")},
				{ "content": new RegExp(q, "gi")}
			]
		}, callback)
	},
	searchFull: function(q, callback){
		return this.find({
			$text: { $search: q, $caseSensitive: false }
		}, callback)
	}
}

module.exports = model('Blog', postSchema)
