controllers.controller('warehouseInCtrl', function ($scope, $state, $sessionStorage, $stateParams, ionicToast, acceptanceService, warehouseService) {
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('main');
    };
    $scope.selectedItems = [];
    $scope.$on('$ionicView.enter', function () {
        $scope.receivingNote = $stateParams.receivingNote;
        var noteDetail = $stateParams.noteDetail;
        if ($scope.receivingNote == null) {
            return;
        }
        if (noteDetail != null && noteDetail != undefined) {
            $scope.detailInfo = noteDetail;
        } else {
            acceptanceService.details($scope.receivingNote.id, $sessionStorage.token).then(function (res) {
                if (!res.data.success) {
                    ionicToast.show(result.message, 'bottom', false, 1500);
                    return;
                }
                $scope.detailInfo = res.data.message;
            });
        }
        angular.forEach($scope.detailInfo, function (data) {
            if (data.selected) {
                $scope.selectedItems.add(data);
            }
        });
    });
    $scope.confirm = function () {
        var content = [];
        var rv = false;
        angular.forEach($scope.detailInfo, function (data) {
            if (data.warehouse == null || data.position == '') {
                ionicToast.show('需要为所有的药品指定仓库和货位', 'bottom', false, 1500);
                return;
            }
            var el = {};
            el.id = data.id;
            el.warehouseId = data.warehouse.id;
            el.allocation = data.position;
            content.add(el);
            rv = true;
        });
        if (!rv) {
            return;
        }
        warehouseService.warehouseIn(content, $sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                ionicToast.show(result.message, 'bottom', false, 1500);
                return;
            }
            $state.go('main');
            ionicToast.show('商品入库申请成功', 'bottom', false, 1500);
        });
    };
    $scope.select = function (d) {
        angular.forEach($scope.detailInfo, function (data) {
            if (data.id == d.id) {
                data.selected = ~data.selected;
                if (data.selected) {
                    $scope.selectedItems.add(data);
                } else {
                    $scope.selectedItems.remove(data);
                }
            }
        });
    };
    $scope.selectReceivingNote = function () {
        $state.go('receiving-note', {receivingNote: $scope.receivingNote});
    };
    $scope.selectWarehouse = function () {
        $state.go('warehouse', {receivingNote: $scope.receivingNote, noteDetail: $scope.detailInfo});
    };
});
