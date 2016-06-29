/**
 * Created by dev on 2016/5/16.
 */
controllers.controller('SaleSearchGoodsCtrl', function ($scope, $ionicPopup, $state, ProductService, $sessionStorage, ionicToast, $stateParams) {
    var vm = this;
    var patientId;
    var phoneNumber;
    $scope.$on('$ionicView.enter', function () {
        if($stateParams.obj!=null){
            patientId = $stateParams.obj.patientId;
            phoneNumber = $stateParams.obj.phoneNumber;
        }
    });
    vm.drugs = [];
    vm.goodsList = function (v) {
        getDrug(v);
    };
    var getDrug = function (v) {
        var isReturn = false;
        ProductService.getDetailByKey($sessionStorage.token, patientId, isReturn, v).then(function (res) {
            if (res.data.success) {
                vm.drugs = res.data.message;
            } else {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
            }
        })
    };
    vm.add = function (v) {
        var obj={
            patientId:patientId,
            phoneNumber:phoneNumber,
            drugs:v
        };
        $state.go('sale-add-goods', {obj: obj});
    };
    vm.nav = function (name) {
        var obj={
            patientId:patientId,
            phoneNumber:phoneNumber,
            drugs:''
        };
        $state.go(name,{obj: obj});
    };
});
