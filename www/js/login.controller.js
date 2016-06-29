controllers.controller('loginCtrl', function ($scope, $state, $sessionStorage, ionicToast, loginService,localStorageService,$ionicLoading,$timeout) {
    $scope.logoImg = 'img/logo.png';
    if (angular.isDefined($sessionStorage.token)) {
        $state.go('main');
    }
    $scope.showLoading=function(){
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };
    $scope.login = function (user) {
        if(user!=undefined){
            if (user.username == null || user.password == null || user.username == '' || user.password == ''|| user.username == undefined|| user.password ==undefined ){
                ionicToast.show("用户名和密码不能为空", 'bottom', false, 1500);
            } else {
                $scope.showLoading();
                $sessionStorage.token = "xxxx-x-xx-x-x-x-xxx";
                $sessionStorage.staff = {
                                            "name":"崔可可",
                                            "roles":[
                                                "ROLE_BOSS_SYSTEM",
                                                "ROLE_BASIC"
                                            ]
                                        };
                localStorageService.remove('stores');
                localStorageService.remove('id');
                localStorageService.remove('resting');
                localStorageService.remove('drugs');
                $ionicLoading.hide();
                $state.go('main');
                user = null;
                //loginService.login(user)
                //    .then(function (res) {
                //        if (res.data.success) {
                //            //$sessionStorage.token = res.headers('x-auth-token');
                //            $sessionStorage.token = "xxxx-x-xx-x-x-x-xxx";
                //            $sessionStorage.staff = res.data.message;
                //            localStorageService.remove('stores');
                //            localStorageService.remove('id');
                //            localStorageService.remove('resting');
                //            localStorageService.remove('drugs');
                //            $ionicLoading.hide();
                //            $state.go('main');
                //            user = null;
                //        } else{
                //            $ionicLoading.hide();
                //            ionicToast.show(res.data.message, 'bottom', false, 1500);
                //        }
                //    },function(){
                //        $ionicLoading.hide();
                //    });
            }
        }else{
            ionicToast.show("用户名和密码不能为空", 'bottom', false, 1500);
        }
    }
});


