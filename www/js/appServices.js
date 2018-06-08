/**
 * 服务
 */
angular.module('milktruckAPP.services', [])
    .service("commonServices",function($http, $q, HttpFactory,CacheFactory,$rootScope){
        return {
            //获取版本号
            getVer:function(){
                var deferred = $q.defer();
                HttpFactory.send({
                    url: API.Version,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            // 获取评分列表
            login: function (user) {
                var deferred = $q.defer();
                var result={success:false,msg:null};

                HttpFactory.send({
                    url: API.User_Login+'&registrationID='+  CacheFactory.get('registrationID')+'&isIOS='+$rootScope.isIOS,// 记录极光推送的机器ID
                    params: user,
                    method: 'post',
                    mask: true
                }).success(function (response) {
                    if (response.success) {
//                        CacheFactory.save('accessUser', user);
                        CacheFactory.save('accessDriver', response.obj);
                        result.success=true;
                        result.msg='登录成功';
                    } else {
                        result.success=false;
                        if($rootScope.Language==ZH_CN)
                            result.msg=response.message;
                        else

                            result.msg='Incorrect username or password. Please register first without registration';
                    }
                    deferred.resolve(result);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            //一般提交方法 提交的参数，URL
            submit: function (params,apiUrl) {
                var deferred = $q.defer();
                HttpFactory.send({
                    url: apiUrl,
                    method: 'post',
                    params: params
                }).success(function (response) {
                        deferred.resolve(response);
                    }
                ) .error(function(response) {
                        deferred.reject(response);   // 声明执行失败，即服务器返回错误
                    });
                return deferred.promise;
            },

            operationLog:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.OperationLog,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            getBaseParas:function(){
                var accessDriver = $rootScope.accessDriver;
                var parameter={
                    DriverID: accessDriver.ID,
                    DriverName:accessDriver.DriverName,
                    Token:accessDriver.Token,
                    MobileNo:accessDriver.MobileNo,
                    CarNo:accessDriver.CarNo,
                    IDNO:accessDriver.IDNO
                };
                return parameter;
            },
            getUrl:function(pageName,methodName){
//                API_HOST+'/MealOrder.ashx?action=GetMealList'
                return API_HOST+'/'+pageName+'?action='+methodName;
            },
            getData:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: true
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.data);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            getDataNoMask:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.data);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            getDataList:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: true
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.list);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            getDataListNoMask:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.list);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            setLed:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url: API.LightControl,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            }
        }
    })
    .service('IonicService', function ($http, $q, ConfigService, HttpFactory, CacheFactory) {
        return {
            // 获取指定的action数据
            postToServer: function (data,actionURL) {
                var deferred = $q.defer();
                HttpFactory.send({
                    url: actionURL,
                    method: 'post',
                    params: data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    mask: true
                }).success(function (response) {
                        deferred.resolve(response);
                    }
                )
                    .error(function(response) {
                        deferred.reject(response);   // 声明执行失败，即服务器返回错误
                    });
                return deferred.promise;
            }
        }
    })
    .service('ConfigService', [function () {
        var hostURL = "https://sgp-sys.multek.com/Points/";

        var service = {
            getHost: function () {
                return hostURL;
            }
        }
        return service;
    }])
    .service('CacheFactory', function ($window) {
        var append = function (key, value) {
        };
        var save = function (key, value) {
            $window.localStorage.setItem(key, typeof value == 'object' ? JSON.stringify(value) : value);
        };
        var get = function (key) {
            return $window.localStorage.getItem(key) || null;
        };
        var remove = function (key) {
            $window.localStorage.removeItem(key);
        };
        return {
            append: append,
            save: save,
            get: get,
            remove: remove
        };
    })
    .service('SettingFactory', function (CacheFactory) {
        var setting = JSON.parse(CacheFactory.get('setting'));
        var get = function (key) {
            return !!key ? (setting[key] || null) : setting;
        };
        var save = function () {
            if (arguments.length > 1) {
                setting[arguments[0]] = arguments[1];
            } else {
                setting = arguments[0];
            }
            CacheFactory.save('setting', setting);
        };
        var remove = function (key) {
            save(key, null);
        };
        return {
            save: save,
            get: get,
            remove: remove
        };
    })
    .service('HttpFactory', function ($http, $ionicPopup, $ionicLoading, CacheFactory,$rootScope) {

        /**
         * method – {string} – HTTP method (e.g. 'GET', 'POST', etc)
         * url – {string} – Absolute or relative URL of the resource that is being requested.
         * params – {Object.<string|Object>} – Map of strings or objects which will be turned to ?key1=value1&key2=value2 after the url. If the value is not a string, it will be JSONified.
         * data – {string|Object} – Data to be sent as the request message data.
         * headers – {Object} – Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent.
         * xsrfHeaderName – {string} – Name of HTTP header to populate with the XSRF token.
         * xsrfCookieName – {string} – Name of cookie containing the XSRF token.
         * transformRequest – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version. See Overriding the Default Transformations
         * transformResponse – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http response body and headers and returns its transformed (typically deserialized) version. See Overriding the Default Transformations
         * cache – {boolean|Cache} – If true, a default $http cache will be used to cache the GET request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.
         * timeout – {number|Promise} – timeout in milliseconds, or promise that should abort the request when resolved.
         * withCredentials - {boolean} - whether to set the withCredentials flag on the XHR object. See requests with credentials for more information.
         * responseType - {string} - see requestType.
         */
        var send = function (config) {

            !!config.scope && (config.scope.loading = true);

            !!config.mask && $ionicLoading.show({
                template: typeof config.mask == "boolean" ?'请稍后': config.mask
            });

            config.method == 'post' && (config.data = config.data || {}) && ionic.extend(config.data, {
                accesstoken: CacheFactory.get('accessToken')
            });

            ionic.extend(config, {
                timeout: ERROR.TIME_OUT
            });

            var http = $http(config);

            http.catch(function (error) {
                API_HOST = 'https://zhmobile.flextronics.com/MilkTruckAPP';
                if (error.status == 0) {
                    error.data = {
                        template: !navigator.onLine || error.data == '' ?
                            '网络不通':
                            '请求失败, 请稍后重试...'

                    }
                } else if (error.data.error_msg == ERROR.WRONG_ACCESSTOKEN || status == 403) {
                    error.data = {
                        template: '好像是鉴权失效了，该不会是<b>@alsotang</b>的API有啥问题吧？'
                    }
                } else {
                    error.data = {
                        template: '错误信息：' + JSON.stringify(error.data)
                    }
                }
//                $ionicPopup.alert({
//                    title: 'Warning ...',
//                    template: error.data.template,
//                    buttons: [
//                        {
//                            text: '算了',
//                            type: 'button-positive'
//                        }
//                    ]
//                });

                $ionicLoading.show({ template: error.data.template, noBackdrop: true, duration: 2000 });
            });

            http.finally(function () {
                !!config.scope && (config.scope.loading = false);
                !!config.mask && $ionicLoading.hide();
            });

            return http;
        };

        return {
            send: send
        }

    })
    .service('alertService', ['$ionicPopup','$ionicLoading' ,function ($ionicPopup,$ionicLoading) {
        return {
            showAlert: function (stitle,sMsg) {
                $ionicPopup.alert({
                    title:stitle,
                    template: sMsg
                });
            },
            showLoading:function(sMsg){
                $ionicLoading.show({ template: sMsg, noBackdrop: true, duration: 2000 });
            }

        }
    }])
    .service('externalLinksService',function () {
        return {
            openUr: function (url) {
                cordova.ThemeableBrowser.open(url, '_blank', {
                    statusbar: {
                        color: '#0099FF'
                    },
                    toolbar: {
                        height: 44,
                        color: '#0099FF'
                    },
                    title: {
                        color: '#FFFFFF',
                        showPageTitle: true
                    },
                    backButton: {
                        wwwImage: 'img/back_pressed.png',
                        wwwImagePressed: 'img/back_pressed.png',
                        // image: 'back',
                        // imagePressed: 'back_pressed',
                        align: 'left',
                        event: 'backPressed'
                    },
                    closeButton: {
                        wwwImage: 'img/close_pressed.png',
                        wwwImagePressed: 'img/close_pressed.png',
                        // image: 'close',
                        // imagePressed: 'close_pressed',
                        align: 'right',
                        event: 'closePressed'
                    },
                    backButtonCanClose: true
                }).addEventListener('backPressed', function(e) {
//            alert('back pressed');
                }).addEventListener('helloPressed', function(e) {
//            alert('hello pressed');
                }).addEventListener('sharePressed', function(e) {
//            alert(e.url);
                }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
                    //console.error(e.message);
                }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
                    // console.log(e.message);
                });
            }
        }
    })
;
