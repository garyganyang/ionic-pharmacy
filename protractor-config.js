exports.config = {
    //test on mobile devices use appium
    //seleniumAddress: 'http://localhost:4723/wd/hub',

    //test on PC use webdriver-manager, 参考http://www.protractortest.org/#/tutorial, 获知如何安装,启动,测试
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    specs: ['./protractor/*_spec.js'],

    // Reference: https://github.com/appium/sample-code/blob/master/sample-code/examples/node/helpers/caps.js
    directConnect:true,
    capabilities: {
        //公司的红米
        //platformName: 'android',
        //platformVersion: '4.4.4',
        //deviceName: 'edbcddf',

        //甘杨的小米2S
        // platformVersion: '5.0.2',
        //deviceName: '434b1ecb',

        //郭文鹏的小米4
        // platformVersion: '6.0.1',
        // deviceName: '11699629',

        //browserName: "",
        //autoWebview: true,
        //enablePerformanceLogging: true,
        //recreateChromeDriverSessions: true,

        //CHANGE THIS TO YOUR ABSOLUTE PATH
        //app: 'E:/jianfukeji/drugstore/app/ionic/dispensary/platforms/android/build/outputs/apk/android-debug.apk'
        //newCommandTimeout: 60
        framework:'jasmine',
        platformName: 'windows',
        browserName:"chrome"


    }

    // configuring wd in onPrepare
    // wdBridge helps to bridge wd driver with other selenium clients
    // See https://github.com/sebv/wd-bridge/blob/master/README.md
    //onPrepare: function () {
    //    var wd = require('wd'),
    //        protractor = require('protractor'),
    //        wdBridge = require('wd-bridge')(protractor, wd);
    //    wdBridge.initFromProtractor(exports.confi);
    //}
};

