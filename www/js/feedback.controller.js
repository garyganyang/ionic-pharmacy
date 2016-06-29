/**
 * Created by dev on 2016/5/9.
 */
controllers.controller('FeedbackCtrl', function ($scope, $state) {
    $scope.back = function () {
        $state.go('main');
    };
});
