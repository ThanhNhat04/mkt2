import { Schema, model, models } from 'mongoose'

const postProjectStatus = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  }
}, { timestamps: false })

const PostProjectStatus = models.projectstatuse || model('projectstatuse', postProjectStatus)

export default PostProjectStatus