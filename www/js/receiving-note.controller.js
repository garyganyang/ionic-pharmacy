controllers.controller('receivingNoteCtrl', function ($scope, $state, $sessionStorage, $stateParams, ionicToast, acceptanceService) {
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('warehouse-in', {receivingNote: $scope.note, noteDetail: null});
    };
    $scope.$on('$ionicView.enter', function () {
        $scope.note = $stateParams.receivingNote;
        acceptanceService.list($sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
                return;
            }
            $scope.receivingNotes = res.data.message;
            angular.forEach($scope.receivingNotes, function (data) {
                if ($scope.note != null && $scope.note.id == data.id) {
                    data.selected = true;
                    $scope.note = data;
                }
            });
        });
    });
    $scope.select = function (n) {
        angular.forEach($scope.receivingNotes, function (data) {
            data.selected = (data.id == n.id);
        });
        $scope.note = n;
    };
    $scope.confirm = function () {
        if ($scope.note == null) {
            ionicToast.show('未选择任何验收单', 'bottom', false, 1500);
            return;
        }
        $state.go('warehouse-in', {receivingNote: $scope.note, noteDetail: null});
    };
});
