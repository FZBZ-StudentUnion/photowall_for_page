var express = require('express');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var sharp = require('sharp');
var router = express.Router();

var photos = [];
let flag = true;
const root = path.resolve(__dirname, '../../public/images');

function initPhotos(){
  if (flag){
    let images = fs.readdirSync(path.join(root, '/photo'));
    images.forEach(imagename=>{
        if(fs.statSync(path.join(root, '/photo', imagename)).isFile()){
          photos.push({
            filename: imagename.split('.')[0],
            oldFilename: imagename,
            newFilename: imagename.split('.')[0]+'.webp',
            oldFilenameUrl: '/images/photo/'+imagename,
            newFilenameUrl: '/images/webphoto/'+imagename.split('.')[0]+'.webp'
          })
        
          sharp(path.join(root, '/photo', imagename))
          .toFormat('webp')
          .resize(250, 150)
          .extract({width: 250, height: 150, left: 0, top: 0})
          .toFile(path.join(root, '/webphoto', imagename.split('.')[0]+'.webp'), (err, info) => {
            if (err){
              throw err;
            }
          })
      }
    })
    flag = false;
  }
}
initPhotos();
// 处理文件上传
router.post('/photos', (req, res) => {
    const form = formidable({
        multiples: true,
        // set root
        uploadDir: path.join(root, 'photo'),
        keepExtensions: true
      });
    
      form.parse(req, (err, fields, files) => {
        if (err) {
          res.json({
            "code": "1000",
            "msg": "上传失败",
            "data": null
          })
          return;
        }
        //console.log(files);
        let imagename = files.photo.newFilename;
        photos.push({
          filename: imagename.split('.')[0],
          oldFilename: imagename,
          newFilename: imagename.split('.')[0]+'.webp',
          oldFilenameUrl: '/images/photo/'+imagename,
          newFilenameUrl: '/images/webphoto/'+imagename.split('.')[0]+'.webp'
        })
        sharp(path.join(root, '/photo', imagename))
          .toFormat('webp')
          .resize(250, 150)
          .extract({width: 250, height: 150, left: 0, top: 0})
          .toFile(path.join(root, '/webphoto', imagename.split('.')[0]+'.webp'), (err, info) => {
            if (err){
              throw err;
            }
          })
        res.json({
            "code": "0000",
            "msg": "上传成功",
            "data": imagename
        });
      });
});
  
  // 获取已上传照片列表
router.get('/photos/:start', async (req, res) => {
    const perPage = 15;
    const start = Number(req.params.start);
    let end = start+perPage;

    if(end >= photos.length) end = photos.length;
    console.log(start, end);
    if(Number(start) == Number(end)){
      res.json({
        "code": "0000",
        "msg": "已无图片",
        "data": {photos: [], end: end}
      })
    }else{
      let newPhotos = [];
      if(Number(start) < Number(end)){
        //console.log(photos);
        newPhotos = photos.slice(Number(start), Number(end));
      }
      res.json({
        "code": "0000",
        "msg": "获取成功",
        "data": {photos: newPhotos, end: end}
      })
    }
  });

module.exports = router;
