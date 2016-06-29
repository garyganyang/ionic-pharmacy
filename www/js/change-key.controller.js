/**
 * Created by dev on 2016/5/9.
 */
controllers.controller('ChangeKeyCtrl', function ($scope, $state, $sessionStorage, PasswordService, ionicToast) {
    var vm = this;
    $scope.isShow=true;
    var clear=function(){
        vm.newKey = '';
        vm.nowKey = '';
        vm.startKey='';
    };
    $scope.back = function () {
        $state.go('main');
    };
    $scope.check=function(){
        $scope.isShow=number(vm.nowKey);
        return number(vm.nowKey);
    };
    var number = function (value) {
        var pattern = /^[a-zA-Z0-9]{6,10}$/;
        return value != "" && pattern.test(value)
    };
    $scope.submit = function () {
        if (vm.newKey == '' || vm.nowKey == '' ||vm.startKey==''|| vm.newKey == null || vm.nowKey == null|| vm.startKey==null||!$scope.isShow) {
            ionicToast.show('请正确填写所有信息', 'bottom', false, 1500);
        } else {
            var params = {
                "originalPassword": vm.startKey,
                "password": vm.newKey
            };
            if (vm.newKey != vm.nowKey) {
                ionicToast.show('两次输入的密码不一致', 'bottom', false, 1500);
            } else {
                PasswordService.updatePwd($sessionStorage.token, params).then(function (res) {
                    if (res.data.success) {
                        ionicToast.show('密码修改成功', 'bottom', false, 1500);
                        delete $sessionStorage.token;
                        delete $sessionStorage.staff;
                        $state.go('login');
                        clear();
                    } else {
                        ionicToast.show(res.data.message, 'bottom', false, 1500);
                    }
                });
            }
        }
    }
});
