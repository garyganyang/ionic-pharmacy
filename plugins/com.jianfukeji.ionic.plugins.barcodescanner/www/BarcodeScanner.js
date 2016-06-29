var exec = require('cordova/exec');

var BarcodeScanner = function(){
};

BarcodeScanner.singleScan = function(success, error){
    exec(success, error, 'BarcodeScanner', 'scan', ['single']);
};
BarcodeScanner.multipleScan = function(success, error, codes){
    var strCodes = (codes != null && codes != undefined) ? codes.toString() : '';
    exec(function(result){
        var array = result.substring(1, result.length - 1).split(',');//取消[和]，并且根据“,”分离成数组
        if (array == "") {
            array = [];
        }
        success(array);}, error, 'BarcodeScanner', 'scan', ['multiple', strCodes]);
};

module.exports = BarcodeScanner;