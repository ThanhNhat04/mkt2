import { Schema, model, models } from 'mongoose'

const postFoundation = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  banner: {
    type: String,
  },
  link: {
    type: String,
  },
  type: {
    type: String
  }
})

const PostFoundation = models.foundation || model('foundation', postFoundation)

export default PostFoundation