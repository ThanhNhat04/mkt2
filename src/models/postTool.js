import { Schema, model, models } from 'mongoose'

const postTool = new Schema({
  Name: {
    type: String,
  },
  Description: {
    type: String,
  },
  Image: {
    type: String,
  },
  Tool: {
    type: String,
  },
  Tag: {
    type: String,
  },
})

const PostTool = models.tool || model('tool', postTool)

export default PostTool