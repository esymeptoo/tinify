module.exports = function (target) {
    var reg = RegExp(/\.(png|jpg)/)
    if (reg.test(target)) {
        return true
    }
    return false
}