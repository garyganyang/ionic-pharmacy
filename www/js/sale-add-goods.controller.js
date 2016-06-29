/**
 * Created by dev on 2016/5/16.
 */
controllers.controller('SaleAddGoodsCtrl', function ($scope, $ionicPopup, $state, ProductService, $sessionStorage, ionicToast, $stateParams, $ionicActionSheet, localStorageService) {
    var vm = this;
    vm.nav = function (name) {
        $state.go(name);
        localStorageService.remove('drugs');
    };
    var patientId;
    var phoneNumber;
    vm.drugs = [];
    vm.sale_change = 0;
    vm.sale_preferential = 0;
    vm.sale_debt = 0;
    vm.sale_total = 0;
    vm.sale_pay = 0;
    vm.realPay = 0;
    var calculate = function () {
        vm.sale_total = 0;
        vm.sale_preferential = 0;
        vm.sale_pay = 0;
        vm.realPay = 0;                                                         //实收
        vm.total = 0;                                                         //商品数量总计
        if (vm.drugs.length != 0) {
            angular.forEach(vm.drugs, function (v) {
                v.sale_total = v.price / 100 * v.count; //每条药的原价总计
                v.sale_pay = v.price / 100 * v.discount / 100 * v.count;//每条药的折后合计金额
                v.sale_preferential = v.sale_total - v.sale_pay;//每条药的优惠
                vm.sale_total = vm.sale_total + v.sale_total;//总计
                vm.sale_preferential = vm.sale_preferential + v.sale_preferential;//优惠
                vm.sale_pay = vm.sale_pay + v.sale_pay; //应收
                vm.realPay = vm.sale_pay.toFixed(2);//实收
                vm.total = vm.total * 1 + v.count * 1;
            });
        }
    };
    vm.searchActivity = function (drug) {
        if (drug.activities != null && drug.activities.length != 0) {
            var vIndex;
            angular.forEach(drug.activities, function (v, index) {
                if (drug.activityId == v.id) {
                    vIndex = index;
                }
            });
            var activityId = drug.activityId;
            var productId = drug.id;
            ProductService.searchActivity($sessionStorage.token, activityId, productId).then(function (res) {
                if (res.data.success) {
                    var activity = res.data.message;
                    var a = parseInt(drug.count / drug.activities[vIndex].minCount);
                    activity.gift = drug.id;
                    activity.originalCount = activity.count;
                    if (activity.originalCount * a > 0) {
                        var giftFlag = false;
                        angular.forEach(vm.drugs, function (v, k) {
                            if (v.gift == activity.gift) {
                                giftFlag = true;
                                vm.drugs[k].count = activity.originalCount * a;
                            }
                        });
                        if (!giftFlag) {
                            activity.count = activity.originalCount * a;
                            vm.drugs.splice(vm.drugs.indexOf(drug) + 1, 0, activity)
                        }
                    } else {
                        angular.forEach(vm.drugs, function (v, k) {
                            if (v.gift == activity.gift) {
                                vm.drugs.splice(k, 1)
                            }
                        });
                    }
                    calculate();
                } else {
                    ionicToast.show(res.data.message, 'bottom', false, 1500);
                }
            })
        }
    };
    var getTab = function (drug) {
        drug.count = 1;
        drug.gift = "good";
        if (vm.drugs.length == 0) {
            vm.drugs.push(drug);
        } else {
            var isTrue = true;
            angular.forEach(vm.drugs, function (v) {
                if (drug.id == v.id) {
                    v.count = parseInt(v.count) + 1;
                    drug.count = v.count;
                    isTrue = false;
                }
            });
            if (isTrue) {
                vm.drugs.push(drug);
            }
        }
        vm.drugName = drug.name;
        vm.specifications = drug.specifications;
        vm.price = drug.price;
        calculate();
        if (drug.activities != null && drug.activities.length != 0) {
            drug.acName = drug.activities[0].name;
            drug.activityId = drug.activities[0].id;
            vm.searchActivity(drug);
        }
        //console.log('drugs',vm.drugs)
    };
    $scope.$on('$ionicView.enter', function () {
        if($stateParams.obj!=null){
            patientId = $stateParams.obj.patientId;
            phoneNumber = $stateParams.obj.phoneNumber;
            var drugs=$stateParams.obj.drugs;
            if(drugs!=''){
                getTab(drugs);
            }
        }
    });
    var getDrugs= localStorageService.get('drugs');
    if(getDrugs!=''&& getDrugs!=null){
        vm.drugs=getDrugs;
    }
    vm.goSearchGoods = function () {
        if(vm.drugs.length!=0){
            localStorageService.set('drugs', vm.drugs);
        }
        var obj={
            patientId:patientId,
            phoneNumber:phoneNumber,
            drugs:''
        };
        $state.go('sale-search-goods', {obj:obj})
    };

    vm.reduce = function (v, index) {
        v.count--;
        if (v.count == 0) {
            vm.drugs.splice(index, 1);
        }
        calculate();
        vm.searchActivity(v);
    };
    vm.add = function (v) {
        v.count++;
        calculate();
        vm.searchActivity(v);

    };

    var codes = [];
    $scope.camera = function () {
        window.BarcodeScanner.multipleScan(function (result) {
            $scope.$apply();
            ionicToast.show(result, 'bottom', false, 1500);
            getList(result);
        }, function (e) {
            ionicToast.show(e, 'bottom', false, 1500);
        }, codes);
    };
    var getList = function (result) {
        angular.forEach(result, function (v) {
            getDrug(v);
        })
    };
    var getDrug = function (v) {
        var isReturn = false;
        ProductService.getDetailByKey($sessionStorage.token, patientId, isReturn, v).then(function (res) {
            if (res.data.success) {
                var drug = res.data.message[0];
                if (drug != '' && drug != null) {
                    getTab(drug);
                }
                if(drug == '' || drug == null||drug ==undefined){
                    ionicToast.show('药品不存在', 'bottom', false, 1500);
                }
            } else {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
            }
        })
    };
    vm.show = function (n) {
        var activitys = [];
        angular.forEach(n.activities, function (v) {
            var button = {
                text: v.name,
                activityId: v.id
            };
            activitys.push(button);
        });
        var hideSheet = $ionicActionSheet.show({
            buttons: activitys,
            titleText: '选择优惠',
            cancelText: '完成',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                angular.forEach(activitys, function (v, k) {
                    if (index == k) {
                        n.acName = v.text;
                        n.activityId = v.activityId;
                        vm.searchActivity(n);
                    }
                });
                return true;
            }
        });
    };
    vm.submit = function () {
        var items = {
            drugs: vm.drugs,
            sale_pay: vm.sale_pay, //应收
            total: vm.total, //数量
            realPay: vm.realPay, //实收
            sale_change: vm.sale_change, //找零
            phoneNumber: phoneNumber
        };
        var obj = {
            page: "addGoods",
            bill: "",
            addGoods: items,
            member: '',
            goodsList: ''
        };
        localStorageService.remove('drugs');
        $state.go('sale', {obj: obj});
    }
});
