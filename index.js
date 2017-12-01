const Service = require('./services')
const service = new Service()
const co = require('co')

const imgList = service.getImgList()
service.parallel(imgList)
.then( _res => {
  console.log('压缩成功')
}, err => {
    console.log('压缩失败')
})