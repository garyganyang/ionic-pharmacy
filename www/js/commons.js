Array.prototype.add = function (el) {
    var index = this.indexOf(el);
    if (index == -1) {
        this.push(el);
    }
};
Array.prototype.remove = function (el) {
    var index = this.indexOf(el);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.has = function (el) {
    return this.indexOf(el) > -1;
};

var isEmpty = function (value) {
    if (value == null || value == undefined) {
        return false;
    }
    var v = value.replace(/(^\s*)|(\s*$)/g, '');
    return v.length == 0;
};
var isDigit = function (value) {
    if (value == null || value == undefined) {
        return false;
    }
    var v = value.toString().replace(/(^\s*)|(\s*$)/g, '');
    var re = /^\d+$/g;
    return re.test(v);
};
var isPrice = function (value) {
    if (value == null || value == undefined) {
        return false;
    }
    var re = /^\d+\.{0,1}\d*$/g;
    return re.test(value);
};
