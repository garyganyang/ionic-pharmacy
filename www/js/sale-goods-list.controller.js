/**
 * Created by dev on 2016/5/16.
 */
controllers.controller('SaleGoodsListCtrl', function ($scope, $ionicPopup, $state, $stateParams) {
    var vm = this;
    $scope.$on('$ionicView.enter', function () {
        if ($stateParams != null) {
            vm.drugs = $stateParams.obj.drugs;
        }
    });
    vm.nav = function (name) {
        var obj = {
            page: "goodsList",
            bill: "",
            addGoods: '',
            member: '',
            goodsList: $stateParams.obj
        };
        $state.go(name, {obj: obj});
    };
});
