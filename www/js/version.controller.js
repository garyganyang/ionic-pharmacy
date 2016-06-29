controllers.controller('versionCtrl', function ($scope, $state) {
    $scope.back = function () {
        $state.go('main');
    };
    $scope.logoImg = 'img/logo.png';
    $scope.version = "1.0.0";
    $scope.buildNumber = "20160123123";
});
