/**
 * Created by dev on 2016/5/9.
 */
controllers.controller('ScmCtrl', function ($scope, $state, $sessionStorage, PasswordService, ionicToast, MemberService) {
    var vm = this;
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    vm.nav = function (name) {
        $state.go(name);
    };
    var getMembers = function () {
        MemberService.getList($sessionStorage.token, 5, 0, vm.searchValue || '').then(function (res) {
            if (res.data.success) {
                vm.memberList = res.data.message.list;
            } else {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
            }
        });
    };
    getMembers();
    vm.searchMember = function (v) {
        vm.searchValue = v;
        getMembers();
    };
    vm.choose = function (v) {
        var obj = {
            page: "choose",
            bill: '',
            addGoods: '',
            member: v
        };
        $state.go('sale', {obj: obj}, {reload: 'sale'});
    };

});
