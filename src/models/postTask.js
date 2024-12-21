import { Schema, model, models } from 'mongoose'

const postTask = new Schema({
  name: { type: String },
  project: { type: Schema.Types.ObjectId },
  detail: { type: String },
  doer: { type: Schema.Types.ObjectId },
  checker: { type: Schema.Types.ObjectId },
  startDate: { type: Date },
  endDate: { type: Date },
  notes: { type: String },
  doerDone: { type: Boolean },
  checkerDone: { type: Boolean },
  linkDrive: { type: String },
  taskCategory: { type: Schema.Types.ObjectId },
  subTask: {
    type: Array,
    default: []
  }
}, { timestamps: true });

const PostTask = models.task || model('task', postTask)
export default PostTask
