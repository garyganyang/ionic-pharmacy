/**
 * Created by dev on 2016/5/18.
 */
controllers.controller('ChangeMemberCtrl', function ($scope, $ionicPopup, $state, MemberService, $stateParams, $sessionStorage, HealthTypeService, MemberLevelService) {
    var vm = this;
    vm.nav = function (name) {
        $state.go(name, {list: list});
    };
    var list = null;
    $scope.$on('$ionicView.enter', function () {
        list = $stateParams.list;
        MemberService.getMemberByNumber($sessionStorage.token, list.mobile).then(function (res) {
            if (res.data.success) {
                vm.list = res.data.message.patient;
                vm.member = res.data.message.member;
                var healthType = res.data.message.patient.medicalInsuranceType;
                var level = res.data.message.member.level;
                MemberLevelService.getList($sessionStorage.token).then(function (res) {
                    if (res.data.message) {
                        vm.memberLevels = res.data.message;
                        angular.forEach(vm.memberLevels, function (v) {
                            if (v.name === level) {
                                vm.selectedMemberLevel = v;
                            }
                        });
                    }
                });
                HealthTypeService.getHealthTypeList($sessionStorage.token).then(function (res) {
                    if (res.data.success) {
                        vm.healthTypes = res.data.message;
                        angular.forEach(vm.healthTypes, function (v) {
                            if (healthType != null) {
                                if (v.key === healthType) {
                                    vm.selectedHealthType = v;
                                }
                            }
                        });
                    }
                });
            }
        });
    });
    vm.saveChangeMember = function () {
        var params = {
            id: vm.member.id,
            level: vm.selectedMemberLevel.id,
            info: {
                name: vm.list.name,
                idCard:vm.list.idCard,
                gender: vm.list.gender,
                mobile: vm.list.mobile,
                birthDay:vm.list.birthDay
            }
        };
        params.info.address = vm.list.address;
        params.info.socialSecurity = {
            medicalInsuranceType: vm.selectedHealthType.key
        };
        MemberService.modifyMember($sessionStorage.token, params).then(function (res) {
            if (res.data.success) {
                list.mobile = vm.list.mobile;
                list.level = vm.selectedMemberLevel.name;
                $state.go('member-detail', {list: list});
            }
        });
    }

});
