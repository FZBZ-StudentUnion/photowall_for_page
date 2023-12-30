function uploadPhoto() {
    var form = document.getElementById('uploadForm');
    var formData = new FormData(form);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/photos', true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // 上传成功，刷新已上传照片列表
        
      } else {
        console.error('文件上传失败：', xhr.statusText);
      }
    };

    xhr.send(formData);
}
let start = 0;
let stateFlag = false;

function loadPhotos() {
    if (stateFlag) return;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/photos/${start}`, true);

    stateFlag = true;
    xhr.onload = function () {
      if (xhr.readyState === 4){
        stateFlag = false;
        if (xhr.status === 200) {
          // 清空已上传照片列表
          const container = document.getElementById('photoList');

          // 解析服务器返回的JSON数据
          var {photos, end} = JSON.parse(xhr.responseText).data;
          console.log(photos, end);
          // 更新已上传照片列表
          if (photos.length != 0){
            photos.forEach(photo=>{
              var item = document.createElement('div');
              item.className = 'photoItem';
              var a = document.createElement('a');
              a.href = photo.oldFilenameUrl;
              var img = document.createElement('img');
              //img.src = `data:image/jpeg;base64,${photo.image}`; // 图片地址
              img.src = photo.newFilenameUrl; // 图片地址
              img.alt = photo.filename; // 图片文件名作为alt文本
              img.className = 'photo';
              a.appendChild(img);
              item.appendChild(a);
              container.appendChild(item);
            });
          }else{
            stateFlag = true;
          }
          start = Number(end);
        } else {
          console.error('获取已上传照片列表失败：', xhr.statusText);
        }
      }
    };

    xhr.send();
}

const scrollDiv = document.getElementById('scrollDiv');

window.addEventListener('load', loadPhotos);

// Load more photos when scrolling to the bottom
scrollDiv.addEventListener('scroll', () => {
    if (scrollDiv.clientHeight + scrollDiv.scrollTop >= scrollDiv.scrollHeight - 150) {
        loadPhotos();
    }
});