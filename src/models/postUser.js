import { Schema, model, models } from 'mongoose'

const postUser = new Schema({
  Name: {
    type: String,
  },
  Address: {
    type: String,
  },
  Avt: {
    type: String,
  },
  Role: {
    type: Object,
  },
  Phone: {
    type: String,
  },
  Email: {
    type: String,
  },
  Password: {
    type: String,
  },
})

const PostUser = models.user || model('user', postUser)

export default PostUser