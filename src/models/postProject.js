import { Schema, model, models } from 'mongoose'

const postProject = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: Schema.Types.ObjectId,
  },
  piority: {
    type: Number,
  },
  checker: {
    type: Schema.Types.ObjectId,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  doerDone: {
    type: Boolean
  },
  notes: {
    type: Boolean
  },
  linkDrive: {
    type: String
  },
  members: {
    type: [Schema.Types.ObjectId]
  },
  calendarId: {
    type: String
  },
  leader: {
    type: [Schema.Types.ObjectId]
  },
  status: {
    type: String
  }
})

const PostProject = models.project || model('project', postProject)

export default PostProject