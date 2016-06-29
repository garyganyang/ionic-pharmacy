/**
 * Created by dev on 2016/5/9.
 */
controllers.controller('SlbCtrl', function ($scope, $state, $sessionStorage, localStorageService) {
    var vm = this;

    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    vm.nav = function (name) {
        $state.go(name);
    };
    var items = {};
    vm.drugs = [];
     vm.drugs=localStorageService.get("restingTime");
    vm.fetch = function (item) {
        angular.forEach(vm.drugs, function (v, k) {
            if (item.restingTime == v.restingTime) {
                items = v;
                vm.drugs.splice(k, 1);
                localStorageService.set("restingTime", vm.drugs);

            }
        });
        var obj = {
            page: "lading",
            bill: items,
            addGoods: '',
            member: '',
            goodsList: ''
        };
        $state.go('sale', {obj: obj});

    };

});
