const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const cloudinary = require('cloudinary');
const {body, validationResult} = require('express-validator/check');

const Tag = require('../models/tag');

//Multer naming
const storage = multer.diskStorage({
  filename: function(req, res, cb){
    cb(null, res.fieldname+'-'+ Date.now())
  }
});
const upload = multer({
  storage: storage
});
//cloudinary
cloudinary.config({
  cloud_name: 'sronikle',
  api_key : '837478342353245',
  api_secret: 'dcAG3aQRKW-QCdKMZwHtx5tdgxM'
});

//request tags/add
router.get('/add',ensureAuthenticated, function(req, res){
  res.render('addtag',{
    errors: req.flash('error')
  });
});

//create new tag
router.post('/add', upload.single('image'),[
  body('tagname', 'Add name to tag image').isLength({min:1}),
  body('image').optional(),
  body('description', 'Add decrption to tag image').isLength({min:1}),
  body('location', 'Add location to tag image').isLength({min:1}),
  ], function(req, res){
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('addtag',{
      user: req.user,
      errors: errors.array()
    });
  }else{
    cloudinary.v2.uploader.upload(req.file.path,
      function(err, result){
        if(err) {
          req.flash('error', err.message);
          return res.redirect('back');
        };
        //create new tag schema
        var newTag = new Tag({
          author: {
            id: req.user._id,
          username: req.user.username
          },
          tagname: req.body.tagname,
          image: result.secure_url,
          imageID: result.public_id,
          description: req.body.description,
          location: req.body.location
        });

        newTag.save(function(err){
          if(err){
            console.log(err);
            return;
          }else {
            console.log('Added new Tag');
            res.redirect('/tag/add')
          }
        });
    });
  }
});


//display all tags
router.get('/all', function(req,res){
  Tag.find({}, function(err, allTags){
    if(err){
      console.log(err)
    }else {
      res.render('display', {
        tags: allTags
      });
    }
  });
});

//diplay single tag
router.get('/:id', function(req, res){
  Tag.findById(req.params.id, function(err, tag){
    res.render('tag',{
      tag: tag
    });
  });
});

//handle delete
router.delete('/:id', function(req, res){
  var query = {_id: req.params.id}
  Tag.findById(req.params.id, function(err, tag){
    cloudinary.v2.uploader.destroy(tag.imageID, function(err, result){
      //the user has to be the same owner as image in order to send delete
      Tag.remove(query, function(err){
        if(err) return console.log(err);
        res.send('Success');
      });
    });

  });
});

//Post edit form
router.post('/edit/:id', [
  body('tagname', 'Add name to tag image').isLength({min:1}),
  body('description', 'Add decrption to tag image').isLength({min:1}),
  body('location', 'Add location to tag image').isLength({min:1})],
  function(req, res){
  var errors = validationResult(req);
  if(!errors.isEmpty()){
    //return previous page with user info
    Tag.findById(req.params.id, function(err, tag){
      res.render('tag',{
        errors: errors.array(),
        tag: tag,
        user: req.user,
      });
    });
  }else{
    //send updated data
    var updateData = {
      tagname: req.body.tagname,
      description: req.body.description,
      location: req.body.location
    }
    //the user does matches the photo, so he can update
    Tag.findByIdAndUpdate(req.params.id, {$set: updateData}, function(err, tag){
      if(err) return console.log(err);
      res.redirect('/tag/' + tag._id);
    })
  }
});


// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
