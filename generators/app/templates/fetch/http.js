import $u from '../utils/util.js'
 
class Http { 
    constructor() {
        const environment = 'dev'; // dev = 开发 | test = 测试 | demo = 演示环境 | product = 生产环境
        switch (environment) {
            case 'dev':
                this.baseUrl = '';
                this.$img = '';
                this.$simg = ''
                break;
            case 'test':
                this.baseUrl = '';
                this.$img = '';
                this.$simg = ''
                break;
            case 'demo':
                this.baseUrl = '';
                this.$img = '';
                this.$simg = ''
                break;
            case 'product':
                this.baseUrl = '';
                this.$img = '';
                this.$simg = ''
                break;
        }

        this.interceptObj = (options) => {
            // 全局状态码影响
            let obj = {
                197: `hanld200`,  
                199: `hanld200`,
                200: `hanld200`,
                203: `hanld203`,
                205: `hanld205`,
                def: `hanldDef`
            }
            return $u.switchs(options, obj, `hanldDef`)
        }

        this.resposeData = {}
    }

    // 公用请求头方法
    setHeader(form) {
        let addHeader = {
            token: wx.getStorageSync('token'),
            clientType: 'WX'
        }
        let obj = {
            'Content-type': `application/x-www-form-urlencoded`
        }
        if (form) {
            addHeader = Object.assign(addHeader, obj)
        }
        return addHeader
    }

    // 公用拦截
    intercept(res, resolve, reject) {
        const {
            code,
            data
        } = res.data
        this.resposeData = res.data
        this[this.interceptObj(code)](resolve, reject)
    }

    // 公用拦截200
    hanld200(resolve) {
        resolve(this.resposeData)
    }

    // 公用拦截203
    hanld203(resolve, reject) {
        const {
            msg
        } = this.resposeData
        reject(this.resposeData)
        $u.showToast(msg)
        setTimeout(() => {
            wx.switchTab({
                url: '/pages/me/me/me',
            })
        }, 800)
    }

    // 公用拦截204
    hanld205(resolve, reject) {
        resolve(this.resposeData)
    }

    // 公用拦截其他状态码
    hanldDef(resolve, reject) {
        const {
            msg
        } = this.resposeData
        reject(this.resposeData)
        $u.showToast(msg)
    }

    // get请求
    get(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data: params,
                header: this.setHeader(),
                success(res) {
                    api.intercept(res, resolve, reject)
                }
            })
        })
    }

    // 没有使用拦截器的请求
    noIntercept(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data: params,
                header: this.setHeader(),
                success(res) {
                    wx.hideLoading()
                    const {
                        code
                    } = res.data
                    if (code === 200) {
                        resolve(res.data)
                    }else {
                        reject(res.data)
                    }
                }
            })
        })
    }

    // post请求
    post(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method: 'POST',
                data: params,
                header: this.setHeader(true),
                success(res) {
                    api.intercept(res, resolve, reject)
                }
            })
        })
    }

    // json格式post请求
    postJson(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method: 'POST',
                data: params,
                header: this.setHeader(),
                success(res) {
                    api.intercept(res, resolve, reject)
                }
            })
        })
    }

    // 上传文件
    upload(url, params, filePath) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: this.baseUrl + url,
                filePath,
                name: 'filedata',
                formData: params,
                success(res) {
                    wx.hideLoading()
                    res = JSON.parse(res.data)
                    resolve(res)
                },
            })
        })
    }

    // 上传图片
    updataAvatar(url, params) {
        const self = this
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 1,
                success(res) {
                    let tempFilePaths = res.tempFilePaths
                    wx.uploadFile({
                        url: self.baseUrl + url,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: params,
                        header: self.setHeader(),
                        success(res) {
                            res = JSON.parse(res.data)
                            resolve(res)
                        },
                        fail() {
                            wx.showToast({
                                icon: 'none',
                                title: '上传失败',
                            })
                        }
                    })
                }
            })
        })
    }
}

export default new Http()