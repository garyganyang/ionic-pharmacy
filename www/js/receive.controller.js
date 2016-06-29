controllers.controller('receiveCtrl', function ($scope, ionicToast, $ionicPopup, $state, $ionicActionSheet, $sessionStorage, acceptanceService, $stateParams) {

    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('main');
    };
    $scope.receivingItems = {
        vendorId: null,
        receivingNo: '',
        items: []
    };
    $scope.show = false;
    $scope.pharList = [];

    $scope.receivingNote = {
        vendor: {},
        receivingNo: ''
    };

    $scope.$on('$ionicView.enter', function () {

        $scope.pharList = $stateParams.pharList;
        $scope.receivingNote = $stateParams.receivingNote;


        if ($scope.pharList == null) {
            $scope.pharList = [];
        }
        $scope.show = true;
    });

    $scope.selectVendors = function () {
        $state.go('vendors-select', {pharList: $scope.pharList, receivingNote: $scope.receivingNote});
    };
    $scope.modifyCount = function (p) {
        $scope.data = {};
        $scope.data.unqualifiedCount = p.unqualifiedCount;
        $scope.data.failedOperation = p.failedOperation;
        var editMessage = $ionicPopup.show({
            title: '修改不合格数量',
            template: '<ul class="list"><li class="list-label">不合格数量：<input style="border:solid 1px #999999;" ng-model="data.failedCount"></li>' +
            '<li class="list-label">处理方式：<textarea style="border:solid 1px #999999;" rows="4" ng-model="data.failedOperation"></textarea></li></ul>',
            scope: $scope,
            buttons: [
                {text: '取消', type: 'popup-button-my'},
                {
                    text: '确定',
                    onTap: function () {
                        return $scope.data;
                    }
                }]
        });
        editMessage.then(function (res) {
            if (!angular.isUndefined(res)) {
                p.failedCount = res.failedCount;
                p.failedOperation = res.failedOperation;
            }
        });
    };

    $scope.modifyMessage = function (p) {
        $state.go('add-manually', {
            pharList: $scope.pharList,
            receivingNote: $scope.receivingNote,
            isModify: true,
            drugNote: p
        });
    };

    $scope.deleteItem = function (p) {
        $scope.pharList.remove(p);
    };
    $scope.submit = function () {
        if ($scope.pharList.length == 0) {
            ionicToast.show("没有验收单，请添加！", 'bottom', false, 1500);
            return;
        }
        if ($scope.receivingNote.vendor == null) {
            ionicToast.show("请先选择供货商", 'bottom', false, 1500);
            return;
        }
        if ($scope.receivingNote.receivingNo == null || $scope.receivingNote.receivingNo.trim() == '') {
            ionicToast.show("购进单号未填写", 'bottom', false, 1500);
            return;
        }

        $scope.receivingItems.vendorId = $scope.receivingNote.vendor.id;
        $scope.receivingItems.receivingNo = $scope.receivingNote.receivingNo;
        $scope.receivingItems.items = [];
        angular.forEach($scope.pharList, function (data) {
            var acceptOrder = {
                batchCode: {
                    id: null,
                    info: {}
                }
            };
            acceptOrder.batchCode.id = data.batchCodeId;
            acceptOrder.batchCode.info.batchCode = data.batchCode;
            acceptOrder.batchCode.info.produceDay = data.produceDay;
            acceptOrder.batchCode.info.expireDay = data.expireDay;

            acceptOrder.productId = data.id;
            acceptOrder.purchasePrice = data.purchasePrice * 100;
            acceptOrder.receivingCount = data.receivingCount;
            acceptOrder.failedCount = data.failedCount;
            acceptOrder.failedOperation = data.failedOperation;
            acceptOrder.esCodes = [];
            $scope.receivingItems.items.add(acceptOrder);
        });
        acceptanceService.submit($scope.receivingItems, $sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
                return;
            }
            complete();
            $scope.pharList = [];
            $scope.receivingItems = {};
            $scope.receivingNote = {};
        })
    };
    $scope.addGoods = function () {
        $state.go('add-manually', {
            pharList: $scope.pharList,
            receivingNote: $scope.receivingNote,
            isModify: false,
            drugNote: null
        });

    };

    var complete = function () {
        $ionicPopup.show({
            title: '验收完成',
            content: '如需进行入库，请转至电脑端',
            buttons: [
                {
                    text: '<span class="popup-button">知道了</span>', onTap: function () {
                    $state.go('main');
                }
                }
            ]
        });
    };

});
