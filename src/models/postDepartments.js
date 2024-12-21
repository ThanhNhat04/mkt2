import { Schema, model, models } from 'mongoose'

const postDepartments = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  }
}, { timestamps: false })

const PostDepartments = models.department || model('department', postDepartments)

export default PostDepartments