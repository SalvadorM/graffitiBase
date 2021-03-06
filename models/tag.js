const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  author: {
    id: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String
    }
  },
  tagname: {
    type: String,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  imageID: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  location: {
    type: String,
    require: true
  }
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
