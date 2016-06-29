controllers.controller('settingsCtrl', function ($scope, $state, $sessionStorage, $ionicPopup, ionicToast) {
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('main');
    };
    $scope.deviceBind = function () {
        if (angular.isDefined(typeof cordova.plugins.settings.openSetting)) {
            cordova.plugins.settings.openSetting('bluetooth', function () {
            }, function () {
                ionicToast.show('打开蓝牙设备列表失败', 'bottom', false, 1500);
            });
        }
    };
    $scope.version = function () {
        $state.go('version');
    };
    $scope.signOff = function () {
        $ionicPopup.show({
            title: '注销',
            content: '您是否要注销？',
            buttons: [
                {text: '否'},
                {
                    text: '是', onTap: function () {
                    delete $sessionStorage.token;
                    delete $sessionStorage.staff;
                    $state.go('login');
                }
                }
            ]
        });
    };
    $scope.exit = function () {
        $ionicPopup.show({
            title: '退出',
            content: '您是否要退出？',

            buttons: [
                {text: '否'},
                {
                    text: '是', onTap: function () {
                    ionic.Platform.exitApp();
                }
                }
            ]
        });
    };
    $scope.enterpriseUser = $sessionStorage.enterpriseUser;
});
