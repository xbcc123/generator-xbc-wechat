import api from 'fetch/api'
import util from 'utils/util'
import date from 'utils/date'
import { city } from 'utils/citydata'
import validate from 'utils/validate'
import { logsName } from 'utils/logsName'

const $img = api.$img,
    $simg = api.$simg

App({
    onLaunch() {
        wx.getSystemInfo({
            success(res) {
                const { screenWidth } = res
                res = {...res, ...{
                    widthRadio: screenWidth/375
                }}
                wx.setStorageSync(`deviceInfo`, res)
            }
        })
    },

    onShow (options) {
    },

    $g: {},

    $api: api,

    $img,

    $simg,

    $u: util,

    $logsName: logsName,

    $city: city,

    $d: date,

    $v: validate,
})