/**
 * Created by dev on 2016/1/25.
 */
controllers.controller('purchaseNoteCtrl', function ($scope, $state, $stateParams, $sessionStorage, ionicToast) {
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }
    $scope.back = function () {
        $state.go('receive');
    };
    $scope.selectPurchaseNote = function () {
        $state.go('logistics-note');
    };
    $scope.purchaseNotes = [{
        "id": 445522552255,
        "bookingNote": 4,
        "productType": 30

    }, {
        "id": 445522552255,
        "bookingNote": 4,
        "productType": 30

    }, {
        "id": 445522552255,
        "bookingNote": 4,
        "productType": 30

    }];
});
