var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('photo', {title: '福州第八中学170周年校庆现场照片直播', url: '/images/web/title.jpg'});
});

router.get('/upload', (req, res, next) => {
  res.render('upload');
})

module.exports = router;
