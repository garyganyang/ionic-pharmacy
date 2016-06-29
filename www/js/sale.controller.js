/**
 * Created by dev on 2016/5/16.
 */
controllers.controller('SaleCtrl', function ($scope, $ionicPopup, $state, $sessionStorage, ionicToast, MemberService, $filter, localStorageService, $stateParams, SaleMountService) {
    var vm = this;
    vm.drugs=[];
    vm.nav = function (name) {
        $state.go(name);
    };
    vm.goAdd = function (name) {
        var obj={
            patientId:patientId,
            phoneNumber: vm.phoneNumber,
            drugs:''
        };
        $state.go(name, {obj:obj})
    };
    var initialize = function () {
        vm.drugs = [];
        vm.sale_change = 0;
        vm.sale_total = 0;
        vm.sale_pay = 0;
        vm.realPay = 0;
        vm.name = '';
        vm.code = '';
        vm.bonusP = '';
        vm.total = 0;
    };
    var patientId;
    $scope.$on('$ionicView.enter', function () {
        if ($stateParams.obj != null) {
            var c;
            var addGoods = $stateParams.obj.addGoods;
            var bill = $stateParams.obj.bill;
            var goodsList = $stateParams.obj.goodsList;
            var member = $stateParams.obj.member;
            if ($stateParams.obj.page == "lading") {
                c = bill;
                getInformation(c);
            }
            if ($stateParams.obj.page == "choose") {
                vm.name = member.name;
                vm.code = member.idCard;
                vm.bonusP = member.bonusPoint;
                vm.phoneNumber = member.mobile;
                getMember( member.mobile);
            }
            if ($stateParams.obj.page == "addGoods") {
                c = addGoods;
                getInformation(c);
            }
            if ($stateParams.obj.page == "goodsList") {
                c = goodsList;
                getInformation(c);
            }
        }
    });
    var getInformation = function (v) {
        vm.drugs = v.drugs;
        vm.realPay = v.realPay;//实收
        vm.sale_change = v.sale_change;//找零
        vm.sale_pay = v.sale_pay;//应收
        vm.total = v.total; //数量
        patientId= v.patientId;
        if(v.phoneNumber==undefined||patientId==0){
            v.phoneNumber="default-patient"
        }
        vm.phoneNumber = v.phoneNumber;
        getMember(v.phoneNumber);
    };
    var getMember = function (code) {
        MemberService.getMemberByNumber($sessionStorage.token, code).then(function (res) {
            if (res.data.success) {
                var patient = res.data.message.patient;
                var member = res.data.message.member;
                vm.name = patient.name;
                vm.code = patient.idCard;
                if (member != null) {
                    vm.bonusP = member.bonusPoint;
                }
                patientId = patient.id;
            } else {
                ionicToast.show(res.data.message, 'bottom', false, 1500);
            }
        });
    };
    if($stateParams.obj == null){
       var  a = "default-patient";
        getMember(a);
    }
    var restingTime;
   var restDrug= localStorageService.get("restingTime");
    vm.resting = function () {
        if(vm.drugs!=""){
            var  a = "default-patient";
            var count = 0;
            restingTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss').valueOf();
            angular.forEach(vm.drugs, function (v) {
                count = v.count + count
            });
            var drugObj = {
                restingTime: restingTime,
                drugs: vm.drugs,
                sale_pay: vm.sale_pay,
                realPay: vm.realPay,
                sale_change: vm.sale_change,//找零
                name: vm.name,
                total: vm.total,
                patientId: patientId,
                phoneNumber: vm.phoneNumber
            };
            if(restDrug==null){
                restDrug=[];
            }
            restDrug.push(drugObj);
            localStorageService.set("restingTime", restDrug);
            ionicToast.show("挂单成功！", 'bottom', false, 1500);
            initialize();
            getMember(a);
        }else{
            ionicToast.show("没有内容可以挂单！", 'bottom', false, 1500);
        }
    };
    vm.change = function () {
        vm.sale_change = vm.realPay - vm.sale_pay;
    };
    vm.resetChange = function () {
        vm.realPay = "";
        vm.sale_change = 0;
    };
    vm.calculate = function () {
        var items = [];
        angular.forEach(vm.drugs, function (v) {
            if (v.gift == "good") {
                items.push({"activityId": v.activityId || "", "count": v.count, productId: v.id || ""});
            }
        });
        var params = {
            realPrice: vm.sale_pay * 100,
            patientId: patientId,
            items: items,
            paymentType: "CASH",
            esCodes: []
        };
        if(vm.drugs.length==0){
            ionicToast.show('请选择商品', 'bottom', false, 1500);
        }else{
            SaleMountService.resale($sessionStorage.token, params).then(function (res) {
                if (res.data.success) {
                    params = {};
                    $state.go('sale-settle-accounts', {realPrice: vm.sale_pay});
                } else {
                    ionicToast.show(res.data.message, 'bottom', false, 1500);
                }
            })
        }
    };
    vm.goGoodList = function (name) {
        var obj = {
            drugs: vm.drugs,
            sale_pay: vm.sale_pay, //总计
            realPay: vm.realPay, //实收
            sale_change: vm.sale_change, //找零
            total: vm.total, //数量
            phoneNumber: vm.phoneNumber,
            patientId:patientId
        };
        $state.go(name, {obj: obj})
    };
    vm.cancel = function () {
        initialize();
        ionicToast.show("撤单成功！", 'bottom', false, 1500);
        getMember();
    };
    $scope.back = function () {
        $ionicPopup.show({
            title: '<div class="popup-img"><img  src="img/warn.png" ><span>是否停止销售</span></div>',
            buttons: [
                {
                    text: '确定', onTap: function () {
                    initialize();
                    $state.go('main');
                }
                },
                {
                    text: '继续销售', onTap: function () {
                }
                }
            ]
        });

    };
});
