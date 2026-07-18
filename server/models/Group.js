const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    url: {
      type: String,
      default: 'https://res.cloudinary.com/detsy14mk/image/upload/v1752614934/images_qn9vvc.png'
    },
    public_id: String,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
});

module.exports = mongoose.model('Group', groupSchema);
