/**
 * Created by dev on 2016/5/9.
 */
controllers.controller('AboutCtrl', function ($scope, $state) {
    $scope.back = function () {
        $state.go('main');
    };
    $scope.logoImg = 'img/logo.png';
    $scope.version = "1.0.0";
    $scope.buildNumber = "20160123123";
});
