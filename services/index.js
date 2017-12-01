const tinify = require("tinify");
const async = require('async')
const fs = require('fs')
const path = require('path')
const filterFile = require('../util/filterFile')
tinify.key = "BXGJPDf-YXlJsN2KoJCm-7XA2aoqPu6-";
// tinify.key = 'bnAzSsod-6X6eAldyWIG6JG9yDImajKX'

function Service() {}

Service.prototype.getImgList = function () {
    let imgList = fs.readdirSync(path.resolve(__dirname, '../public/old_images'))
    imgList = imgList.filter( item => {
        return !filterFile(item) === false
    })
    console.log(imgList, imgList.length)
    return imgList
}
//多任务顺序执行
Service.prototype.series = async function (imgList) {
    let res = [];
    for(let i = 0; i < imgList.length; i++) {
        console.log(`>>>>>>>>>>>>>>>>>>开始压缩第${i+1}张: ${imgList[i]}`)
        res.push(await this.reduceImg(imgList[i]))
        console.log(`>>>>>>>>>>>>>>>>>>第${i+1}张压缩成功`)
    }
    return res;
}   
Service.prototype.reduceImg = function (img) {
    return new Promise((resolve, reject) => {
        tinify.fromFile(path.resolve(__dirname, '../public/old_images/' + img)).toFile(path.resolve(__dirname, '../public/new_images/' + img), (err) => {
            err? resolve(0): resolve(1)
        })
    })
}
//封装promise
Service.prototype._promise = function (cb) {
    return new Promise((resolve, reject) => {
        cb.bind(this)(resolve, reject)
    })
}
//多任务并行
Service.prototype.parallel = function (imgList) {
    let index = 0
    return this._promise(function (resolve, reject) {
        async.map(imgList, function (item, callback) {
            index++
            console.log(`>>>>>>>>>>>>>>>>>>开始压缩第${index}张: ${item}`)
            tinify.fromFile(path.resolve(__dirname, '../public/old_images/' + item)).toFile(path.resolve(__dirname, '../public/new_images/' + item), (err) => {
                if (err) {
                    console.log('>>>>>>error')
                    callback(null, 0)
                }
                console.log(`>>>>>>>>>>>>>>>>>>压缩成功: ${item}`)
                // index++
                callback(null, 1)
            })
        }, function (err, result) {
            err? reject(err): resolve(result)
        })
    })
}

module.exports = Service