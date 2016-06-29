angular.module('starter.services', [])
    .factory('loginService', loginService)
    .factory('pharmacopoeiaService', pharmacopoeiaService)
    .factory('warehouseService', warehouseService)
    .factory('acceptanceService', acceptanceService)//验收
    .factory('StoreService', StoreService)//门店
    .factory('PasswordService', PasswordService)//密码
    .factory('SaleMountService', SaleMountService)//销售
    .factory('StockTakeService', StockTakeService)//盘点
    .factory('MemberService', MemberService)//会员管理
    .factory('MemberLevelService', MemberLevelService)//会员等级
    .factory('HealthTypeService', HealthTypeService)//医保类型
    .factory('ProductService', ProductService);//商品

function loginService($http, restUrl, $q) {
    return {
        login: function (user) {
            //return $http({
            //    method: 'POST',
            //    url: restUrl + "common/login",
            //    params: {
            //        "username": user.username,
            //        "password": user.password
            //    },
            //    headers: {'X-Ajax-Mode': true, 'Content-Type': 'application/x-www-form-urlencoded'}
            //});
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            promise.then(function (result) {
                var data = {
                        "success": true,
                        "message": {
                                  "name":"崔可可",
                                  "roles":[
                                          "ROLE_BOSS_SYSTEM",
                                          "ROLE_BASIC"
                                          ]
                                    }
                    };
            }, function (error) {
                alert("Fail: " + error);
            });
            
            return promise;
            
            
            
        },
    exit: function (token) {
        return $http({
            method: 'POST',
            url: restUrl + "/common/logout",
            dataType: 'json',
            headers: {
                'x-auth-token': token
            }
        });
    }
    };

}
/*
 * 查询商品信息
 * */
function pharmacopoeiaService($http, restUrl) {
    return {
        getByBarCode: function (code, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'pharmacy/product/barcode_detail',
                params: {code: code},
                headers: {
                    'x-auth-token': token
                }
            });
        },

        getBatchCode: function (id, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'pharmacy/batch_code/inventory_list',
                params: {
                    productId: id
                },
                headers: {
                    'x-auth-token': token
                }
            });
        },
        getVendorList: function (token) {
            return $http({
                method: 'GET',
                url: restUrl + 'pharmacy/vendor/list',
                dataType: 'json',
                headers: {
                    'x-auth-token': token
                }
            });
        }

    }
}


function warehouseService($http, restUrl) {
    return {
        list: function (token) {
            return $http({
                method: 'GET',
                url: restUrl + 'warehouse',
                dataType: 'json',
                headers: {
                    'x-auth-token': token
                }
            });
        },

        warehouseIn: function (content, token) {
            return $http({
                method: 'POST',
                url: restUrl + 'warehousein',
                data: {
                    comment: '',
                    content: content
                },
                dataType: 'json',
                headers: {
                    'x-auth-token': token
                }
            })
        }
    };
}

function acceptanceService($http, restUrl) {
    return {
        submit: function (content, token) {
            return $http({
                method: 'POST',
                url: restUrl + 'pharmacy/receiving_note/create',
                data: content,
                dataType: 'json',
                headers: {
                    'x-auth-token': token
                }
            });
        }

    };

}
function StoreService($http, restUrl) {
    return {
        getMyStores: function (token) {       //用户可以自己操作的所有门店
            //return $http({
            //    method: 'GET',
            //    url: restUrl + 'pharmacy/store/my_stores',
            //    dataType: "json",
            //    headers: {"x-auth-token": token}
            //});
            return {
                     "success": true,
                     "message": [
                                 {
                                     "id":1,
                                     "enterprise":"九华",
                                     "store":"天府一街店"
                                 },
                                 {
                                     "id":2,
                                     "enterprise":"九华",
                                     "store":"总府路店"
                                 },
                                 {
                                     "id":3,
                                     "enterprise":"九华",
                                     "store":"双楠店"
                                 },
                                 {
                                     "id":4,
                                     "enterprise":"九华",
                                     "store":"牛市口店"
                                 }
                      ]
                   };
        },
        switchStore: function (token, storeId) {   //切换门店
            //return $http({
            //    method: 'PUT',
            //    url: restUrl + 'pharmacy/store/switch?id=' + storeId,
            //    dataType: "json",
            //    headers: {"x-auth-token": token}
            //});
            return {
                      "success": true,
                      "message": {
                                  "enterprise":"九华",
                                  "store":"天府一街店",
                                  "roles":[
                                          "ROLE_BOSS_SYSTEM",
                                          "ROLE_BASIC"
                                          ]
                                  }
                   };
        }
    };
}
function PasswordService($http, restUrl) {
    return {
        updatePwd: function (token, params) { //修改自己的密码
            return $http({
                method: 'POST',
                url: restUrl + 'pharmacy/password/update',
                data: params,
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        }
    };
}
function SaleMountService($http, restUrl) {
    return {
        getSale: function (token) { //销售量统计
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/retail/sale_statistics',
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        },
        resale: function (token, params) { /*结账*/
            return $http({
                method: 'POST',
                url: restUrl + '/pharmacy/retail/create',
                data: params,
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        }
    };
}
function StockTakeService($http, restUrl) {
    return {
        getStockTakeProduct: function (code, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'pharmacy/product/detail_info',
                params: {

                    addBatchCode: true,
                    code: code
                },
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        },
        submit: function (content, token) {
            return $http({
                method: 'POST',
                url: restUrl + 'pharmacy/stocktake/create',
                data: content,
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        }
    }

}
function MemberService($http, restUrl) {
    return {
        getMemberByNumber: function (token, key) {
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/member/detail?key=' + key,
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        },
        memberStatus: function (token, params) {
            return $http({
                method: 'POST',
                url: restUrl + '/pharmacy/member/status',
                data: params,
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        },
        modifyMember: function (token, params) {
            return $http({
                method: 'PUT',
                url: restUrl + '/pharmacy/member/update',
                data: params,
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        },
        scoreMember: function (token, params) {
            return $http({
                method: 'POST',
                url: restUrl + '/pharmacy/member/bonus-exchange',
                data: params,
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        },
        getList: function (token, pageSize, page, key) {
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/member/list',
                params: {
                    key: key,
                    pageSize: pageSize,
                    page: page
                },
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        }
    };
}
function MemberLevelService($http, restUrl) {
    return {
        getList: function (token) {
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/member_level/list',
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        }
    }
}
function HealthTypeService($http, restUrl) {
    return {
        getHealthTypeList: function (token) {
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/medical_insurance_type/list',
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        }
    };
}
function ProductService($http, restUrl) {
    return {
        getDetailByKey: function (token, patientId, isReturn, key) { //根据条码或者编码或者简拼获取商品信息详细
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/product/search_detail?patientId=' + patientId + '&isReturn=' + isReturn + '&key=' + key,
                dataType: 'json',
                headers: {"x-auth-token": token}
            })
        },
        searchActivity: function (token, activityId, productId) {                       //用于销售拆零查询
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/product/search_activity?',
                params: {
                    activityId: activityId,
                    productId: productId
                },
                dataType: 'json',
                headers: {"x-auth-token": token}
            })
        },
        getProductByBath: function (token,productId,code) {//根据商品id和批次前缀获取匹配的批次列表
            return $http({
                method: 'GET',
                url: restUrl + '/pharmacy/product/search-batchcode?',
                params: {
                    productId: productId,
                    code: code
                },
                dataType: "json",
                headers: {"x-auth-token": token}
            });
        }
    };
}
