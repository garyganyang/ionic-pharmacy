/**
 * Created by dev on 2016/5/9.
 */
controllers.controller('StockTakeCtrl', function ($scope, $state, $ionicPopup, $filter, $sessionStorage, ionicToast, moment, StockTakeService,ProductService) {

    var vm = this;
    if (angular.isUndefined($sessionStorage.token)) {
        $state.go('login');
    }

    vm.showMessage = false;
    vm.code = '';
    vm.stockTakeProduct = {};
    vm.stockTakeProfitList = [];
    vm.batchCodes = [];

    var initData = function () {
        vm.showMessage = false;
        vm.code = '';
        vm.stockTakeProduct = {};
        vm.stockTakeProfitList = [];
        vm.batchCodes = [];
    };
    vm.cameraBarcode = function () {
        window.BarcodeScanner.singleScan(function (result) {
            $scope.$apply();
            vm.code = result;
            $scope.findStockTakeProduct();
        }, function (e) {
            ionicToast.show(e, 'bottom', false, 1500);
        });
    };
    $scope.findStockTakeProduct = function () {
        vm.showMessage = false;
        vm.stockTakeProduct = {};
        vm.stockTakeProfitList = [];
        vm.batchCodes = [];

        if (vm.code == null || vm.code.trim() == '') {
            return;
        }
        StockTakeService.getStockTakeProduct(vm.code, $sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                ionicToast.show(res.data.message, 'bottom', false, 1500);

                return;
            }
            vm.stockTakeProduct = res.data.message;
            angular.forEach(vm.stockTakeProduct.batchCode, function (data) {
                var bc = {
                    batchCodeId: null,
                    code: '',
                    productId: null,
                    realCount: null
                };
                if (data.inventoryCount > 0) {
                    bc.batchCodeId = data.id;
                    bc.code = data.code;
                    bc.productId = vm.stockTakeProduct.id;
                    vm.batchCodes.add(bc);
                }
            });
            vm.showMessage = true;

        });
    };
    vm.inventoryProfit = function () {
        var stockTakeProfit = {
            productId: null,
            batchCode: {
                code: '',
                produceDate: '',
                expireDate: ''
            },
            realCount: null
        };
        stockTakeProfit.productId = vm.stockTakeProduct.id;
        vm.stockTakeProfitList.add(stockTakeProfit);
    };

    vm.matchBatchCode = function (st) {
        angular.forEach(vm.stockTakeProduct.batchCode, function (bc) {
            if (st.batchCode.code + "".trim() == bc.code && bc.inventoryCount == 0) {
                st.batchCode.code = bc.code;
                st.batchCode.produceDate = bc.produceDate;
                st.batchCode.expireDate = bc.expireDate;
            }
        });
    };
    $scope.getDate=function(v){
    ProductService.getProductByBath($sessionStorage.token, v.productId, v.batchCode.code).then(function(res){
        if(res.data.success){
            var data=res.data.message;
            angular.forEach(data,function(vv){
                if(vv.code== v.batchCode.code){
                    v.batchCode.produceDate=vv.produceDate;
                    v.batchCode.expireDate=vv.expireDate;
                }
            });
        }else{
            ionicToast.show(res.data.message, 'bottom', false, 1500);
        }
    });
 };
    vm.formatDate = function (st, type) {
        var isPatternDate = false;
        if (type == 'PRODUCE_DATE') {
            if (!(moment(st.batchCode.produceDate, 'YYYYMMDD').isValid() || moment(st.batchCode.produceDate, 'YYYYMM').isValid())) {
                ionicToast.show('日期格式不正确', 'bottom', false, 1500);
                return;
            }
            if (st.batchCode.produceDate.length == 8) {
                st.batchCode.produceDate = moment(st.batchCode.produceDate, 'YYYYMMDD').format('YYYY-MM-DD');

            } else if (st.batchCode.produceDate.length == 6) {
                st.batchCode.produceDate = moment(st.batchCode.produceDate, 'YYYYMM').format('YYYY-MM');

            }
        } else if (type = 'EXPIRE_DATE') {

            if (!(moment(st.batchCode.expireDate, 'YYYYMMDD').isValid() || moment(st.batchCode.expireDate, 'YYYYMM').isValid())) {
                ionicToast.show('日期格式不正确', 'bottom', false, 1500);
                return;
            }
            if (st.batchCode.expireDate.length == 8) {
                st.batchCode.expireDate = moment(st.batchCode.expireDate, 'YYYYMMDD').format('YYYY-MM-DD');

            } else if (st.batchCode.expireDate.length == 6) {
                st.batchCode.expireDate = moment(st.batchCode.expireDate, 'YYYYMM').format('YYYY-MM');
            }

        }
    };


    vm.isCompletedMessage = true;
    vm.completeStockTake = function (key) {
        vm.isCompletedMessage = true;
        var stockTakes = [];

        angular.forEach(vm.batchCodes, function (data) {
            if (data.realCount == null || data.realCount == '') {
                ionicToast.show('请完善盘点商品信息', 'bottom', false, 1500);
                vm.isCompletedMessage = false;
            }
            var st = {
                batchCodeId: null,
                productId: null,
                realCount: null
            };
            st.batchCodeId = data.batchCodeId;
            st.productId = data.productId;
            st.realCount = data.realCount;
            stockTakes.add(st);

        });
        angular.forEach(vm.stockTakeProfitList, function (data) {
            if ((data.batchCode.code != null && data.batchCode.code != '')
                && (data.realCount != null && data.realCount != '')
                && (data.batchCode.produceDate != null && data.batchCode.produceDate != '')
                && (data.batchCode.expireDate != null && data.batchCode.expireDate != '')) {

                if (!(moment(data.batchCode.produceDate, 'YYYY-MM-DD').isValid() || moment(data.batchCode.produceDate, 'YYYY-MM').isValid())) {
                    ionicToast.show('生产日期格式不正确', 'bottom', false, 1500);
                    vm.isCompletedMessage = false;
                    return;
                }
                if (!(moment(data.batchCode.expireDate, 'YYYY-MM-DD').isValid() || moment(data.batchCode.expireDate, 'YYYY-MM').isValid())) {
                    ionicToast.show('有效日期格式不正确', 'bottom', false, 1500);
                    vm.isCompletedMessage = false;
                    return;
                }
                stockTakes.add(data);
            } else {
                if ((data.batchCode.code == null || data.batchCode.code == '')
                    && (data.realCount == null || data.realCount == '')
                    && (data.batchCode.produceDate == null || data.batchCode.produceDate == '')
                    && (data.batchCode.expireDate == null || data.batchCode.expireDate == '')) {
                } else {
                    ionicToast.show('请完善盘盈商品信息', 'bottom', false, 1500);
                    vm.isCompletedMessage = false;
                }
            }
        });


        if (vm.stockTakeProduct.id == null && stockTakes.length == 0) {
            ionicToast.show('请先添加盘点商品', 'bottom', false, 1500);
            return;
        }

        if (!vm.isCompletedMessage) {
            return;
        }

        StockTakeService.submit(stockTakes, $sessionStorage.token).then(function (res) {
            if (!res.data.success) {
                ionicToast.show(res.date.message, 'bottom', false, 1500);
                return;
            }
            initData();
            if (key == 'CONTINUE') {
                return;
            }
            complete();
        });
    };


    $scope.back = function () {

        $ionicPopup.show({
            title: '<div class="popup-img"><img  src="img/warn.png" ><span>是否停止盘点</span></div>',
            buttons: [
                {
                    text: '确定', onTap: function () {
                    initData();
                    $state.go('main');
                }
                },
                {
                    text: '继续盘点', onTap: function () {
                }
                }
            ]
        });

    };

    var complete = function () {
        $ionicPopup.show({
            title: '盘点完成',
            content: '如需查看盘点详情，请转至电脑端',
            buttons: [
                {
                    text: '<span class="popup-button">知道了</span>', onTap: function () {
                    $state.go('main');
                }
                }
            ]
        });
    };

    var warn = function () {

    };
});

