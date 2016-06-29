/**
 * Created by dev on 2016/5/16.
 */
controllers.controller('MemberCtrl', function ($scope, $ionicPopup, $state, MemberService, $sessionStorage) {
    var vm = this;
    vm.nav = function (name) {
        $state.go(name);
    };

    var getMembers = function () {
        MemberService.getList($sessionStorage.token, 5, 0, vm.searchValue || '').then(function (res) {
            if (res.data.success) {
                vm.memberList = res.data.message.list;
            }
        });
    };
    getMembers();
    vm.searchMember = function (v) {
        vm.searchValue = v;
        getMembers();
    };
    vm.checkDetail = function (v) {
        $state.go('member-detail', {list: v});
    };

});
