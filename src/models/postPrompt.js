import { Schema, model, models } from 'mongoose'

const postPromptSchema = new Schema({
    name: { type: String },
    prompt: { type: String },
    tag: { type: String },
}, { timestamps: true });

const PostPrompt = models.prompt || model('prompt', postPromptSchema)
export default PostPrompt
