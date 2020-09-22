import http from './http'
 
class Api { 
    constructor() {
        this.http = http
    }
    
    // 上传图片
    commonUploadImg(params) {
        return this.http.updataAvatar('uploadImg', params)
    }

    // 上传文件
    uploadImg(params, filePath) {
        return this.http.upload('uploadImg', params, filePath)
    }

}

let api = new Api()

export default api