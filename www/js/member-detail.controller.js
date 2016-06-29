/**
 * Created by dev on 2016/5/17.
 */
controllers.controller('MemberDetailCtrl', function ($scope, ionicToast, $state, $stateParams, MemberService, $sessionStorage, $ionicPopup) {
    var vm = this;
    vm.nav = function (name) {
        $state.go(name);
    };
    $scope.$on('$ionicView.enter', function () {
        vm.list = $stateParams.list;
        MemberService.getMemberByNumber($sessionStorage.token, vm.list.mobile).then(function (res) {
            if (res.data.success) {
                vm.list.birthDay = res.data.message.patient.birthDay;
                vm.list.gender = res.data.message.patient.gender;
            }
        });
    });

    vm.openRedeem = function () {
        $scope.data = {};
        $ionicPopup.show({
            title: '兑换积分',
            template: '<input type="text" ng-model="data.redeemNumber">',
            scope: $scope,
            cssClass: 'redeem-style',
            buttons: [
                {text: '取消'},
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.redeemNumber || $scope.data.redeemNumber < 0 || vm.list.bonusPoint < parseInt($scope.data.redeemNumber)) {
                            ionicToast.show('积分不足', 'bottom', false, 1500);
                            e.preventDefault();
                        } else {
                            return $scope.data.redeemNumber;
                        }
                    }
                }]
        }).then(function (res) {
            if (res) {
                var params = {
                    "id": vm.list.id,
                    "exchangeAmount": res
                };
                MemberService.scoreMember($sessionStorage.token, params).then(function (res) {
                    if (res.data.success) {
                        MemberService.getMemberByNumber($sessionStorage.token, vm.list.mobile).then(function (res1) {
                            if (res1.data.success) {
                                vm.list.bonusPoint = res1.data.message.member.bonusPoint;
                            } else {
                                ionicToast.show(res1.data.message, 'bottom', false, 1500);
                            }
                        });
                        ionicToast.show('积分兑换成功', 'bottom', false, 1500);
                    } else {
                        ionicToast.show(res.data.message, 'bottom', false, 1500);
                    }
                })
            }
        });
    };
    vm.changeMember = function () {
        $state.go('change-member', {list: vm.list});
    };
    vm.stopRedeem = function () {
        var status;
        if (vm.list.status == 'NORMAL') {
            $ionicPopup.confirm({
                template: ' 确定要停用该会员?',
                cssClass: 'disable-style',
                cancelText: '取消',
                okText: '确定'
            }).then(function (res) {
                if (res) {
                    status = 'DISABLE';
                    var params = {
                        id: vm.list.id,
                        status: status
                    };
                    MemberService.memberStatus($sessionStorage.token, params).then(function (res) {
                        if (res.data.success) {
                            if (vm.list.status == 'NORMAL') {
                                vm.list.status = 'DISABLE';
                            }
                        } else {
                            ionicToast.show(res.data.message, 'bottom', false, 1500);
                        }
                    })
                }
            });
        } else if (vm.list.status == 'DISABLE') {
            status = 'NORMAL';
            var params = {
                id: vm.list.id,
                status: status
            };
            MemberService.memberStatus($sessionStorage.token, params).then(function (res) {
                if (res.data.success) {
                    if (vm.list.status == 'NORMAL') {
                        vm.list.status = 'DISABLE'
                    } else {
                        vm.list.status = 'NORMAL'
                    }
                }
            })
        }
    }
});
