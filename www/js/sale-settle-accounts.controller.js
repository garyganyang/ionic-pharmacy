/**
 * Created by dev on 2016/5/16.
 */
controllers.controller('SaleSettleAccountsCtrl', function ($scope, $ionicPopup, $state, $stateParams) {
    var vm = this;
    vm.nav = function (name) {
        $state.go(name);
    };
    $scope.$on('$ionicView.enter', function () {
        vm.price = $stateParams.realPrice;
    });
});
