function checkImg () { // 验证图片大小
    let formData = new FormData()
    let files = this.$refs.uploadFile.files
    let size = files[0].size / 1024 / 1024
    let that = this
    if (size < 3) {
        that.uploadFile(files[0])
    } else { // 文件大于3M，向上取整，倍数压缩
        let divisor =  Math.ceil(size / 3)
        var oFile = files[0];
        var reader = new FileReader();
        reader.onload=function(){
            var oImg = new Image();
            oImg.src = this.result;
            oImg.style.display = "none"
            document.body.appendChild(oImg);
            oImg.onload = function(){
                var imgWidth = this.width
                var imgHeight = this.height
                var w = imgWidth / divisor;
                var h = imgHeight / divisor;
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(oImg, 0, 0, w, h);
                const base64 = canvas.toDataURL('image/jpeg', 0.75); // 压缩后质量
                that.uploadFile(that.dataURLtoFile(base64))
            };
        };
        reader.readAsDataURL(oFile);
    }
}
function dataURLtoFile (dataurl) { 
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `file.${suffix}`, {
        type: mime
    })
}
