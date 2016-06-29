controllers.controller('warehouseCtrl', function ($scope, $state, $sessionStorage, $stateParams, ionicToast, warehouseService) {
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('warehouse-in', {receivingNote: $scope.receivingNote, noteDetail: $scope.noteDetail})
    };
    $scope.temp = {};
    $scope.$on('$ionicView.enter', function () {
        $scope.receivingNote = $stateParams.receivingNote;
        $scope.noteDetail = $stateParams.noteDetail;
        if ($scope.noteDetail == null || $scope.noteDetail.length == 0) {
            return;
        }
        warehouseService.list($sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                ionicToast.show(result.message);
                return;
            }
            $scope.warehouses = res.data.message;
        });
    });
    $scope.displayWarehouses = false;
    $scope.rowClass = "ion-ios-arrow-down";
    $scope.showWarehouses = function () {
        $scope.displayWarehouses = ~$scope.displayWarehouses;
        $scope.rowClass = $scope.displayWarehouses ? "ion-ios-arrow-up" : "ion-ios-arrow-down";
    };

    $scope.select = function (w) {
        $scope.warehouse = w;
        angular.forEach($scope.warehouses, function (data) {
            if (data.id == w.id) {
                data.selected = true;
            } else {
                data.selected = false;
            }
        });
        $scope.displayWarehouses = false;
        $scope.rowClass = "ion-chevron-down";
    };
    $scope.confirm = function () {
        if ($scope.warehouse == null) {
            ionicToast.show('未选择要存放的仓库', 'bottom', false, 1500);
            return;
        }
        $scope.temp.position = $scope.temp.position.replace(/(^\s*)|(\s*$)/g, "");
        if ($scope.temp.position.length == 0) {
            ionicToast.show('未选择要存放的货位', 'bottom', false, 1500);
            return;
        }
        angular.forEach($scope.noteDetail, function (data) {
            if (data.selected) {
                data.warehouse = $scope.warehouse;
                data.position = $scope.temp.position;
            }
        });
        $state.go('warehouse-in', {receivingNote: $scope.receivingNote, noteDetail: $scope.noteDetail});
    };
});
