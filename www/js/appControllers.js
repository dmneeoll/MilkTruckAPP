angular.module('milktruckAPP.controllers', [])

    .controller('AppCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,$ionicLoading, $state,$location, CacheFactory,$ionicHistory, SettingFactory, alertService, commonServices) {
        $scope.UserInfo= {
            DriverName:null,
            CarNo:null,
            Password:null

        };
        $scope.UserInfo.Password='';

        $scope.SecCode=null;
        $rootScope.Language = ZH_CN;
        var parameter=null;



        var url=commonServices.getUrl("MilkTruckService.ashx","GetGetDriver");
        commonServices.getDataListNoMask(parameter,url).then(function(data){
            $scope.listDriver=data;

        });
        try
        {
            $scope.UserInfo.CarNo= JSON.parse(CacheFactory.get('CarNo')).CarNo;
            $scope.UserInfo.DriverName=JSON.parse( CacheFactory.get('Driver'));

        }catch (e)
        {

        }




        // $scope.user = JSON.parse(CacheFactory.get('accessUser'));




        $scope.driverUpdate = function () {
            CacheFactory.remove('Driver');
            CacheFactory.save('Driver',$scope.UserInfo.DriverName);


        };
        $scope.btnText="获取验证码";
        $scope.getSecurityCode=function(UserInfo){

            if ( UserInfo.CarNo==null) {
                alertService.showAlert('请选择一个车牌');
                return false;
            }

            var strCarNo= $("#selCarNo").find("option:selected").text();
            var url=commonServices.getUrl("MilkTruckService.ashx","GetSecurityCode");
            commonServices.getData({CarNo:strCarNo},url).then(function(data){
                if(data=="Token is TimeOut"){
                    alertService.showAlert("Token is TimeOut");
                    $state.transitionTo('signin');
                }
                var oBtn = document.getElementById('btnSecurity');
                oBtn.disabled=true;
                var i=60;
                $ionicLoading.show({ template: '已发送验证码到登记的手机号码上！', noBackdrop: true, duration: 2000 });
                var id= setInterval(function(){
                    i=i-1;
                    $scope.$apply(function(){
                        $scope.btnText=i+'秒后重新获取';
                    });

                    if(i==0){
                        $scope.$apply(function(){
                            $scope.btnText='获取验证码';
                        });
                        oBtn.disabled=false;
                        clearInterval(id);
                    };
                },1000);//1000为1秒钟
            });
        };


        $rootScope.autoCheck=false;

        $scope.login = function () {

            console.log('statar')

            if ( $scope.UserInfo.CarNo==null) {
                alertService.showAlert('先绑定车牌');
                return false;
            }
            if ( $scope.UserInfo.DriverName==null) {
                alertService.showAlert('请选择一个司机名字');
                return false;
            }
            if ( $scope.UserInfo.Password==null) {
                alertService.showAlert('请输入身份证后6位');
                return false;
            }

            commonServices.login($scope.UserInfo).then(function(data) {
                var result = data;
                console.log(result)
                if(result.success){
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    $state.go('tab.home');

                }else{
                    alertService.showAlert(result.msg);
                }
            });
        };

        $scope.bangdingCarNo=function(){
            $state.go('BandingCarNo');
        };

    })
    .controller('HomeCtrl', function($scope,$rootScope,$cordovaNativeAudio,$ionicHistory,$ionicSlideBoxDelegate ,$timeout,$state,$ionicPopup,$location,alertService, CacheFactory ,commonServices,externalLinksService) {
        $rootScope.accessDriver = JSON.parse(CacheFactory.get('accessDriver'));
        console.log($rootScope.accessDriver );
        $rootScope.autoCheck=true;
        $ionicHistory.clearHistory();
        var paras= commonServices.getBaseParas();

        if (!$rootScope.accessDriver) {
            alertService.showAlert('凭证过时，请重新登录');
            $state.go('signin');
            return;

        } ;






        $scope.GetDriverData=function(){
            paras= commonServices.getBaseParas();
            var url=commonServices.getUrl("MilkTruckService.ashx","GetDriverBill");
            commonServices.getDataListNoMask(paras,url).then(function(data){

                if(data=="Token is TimeOut")
                {
                    alertService.showAlert("该手机号码和司机账号在已经在别处登录");
                    $state.transitionTo('signin');
                }

                if(data=="该手机号码和司机账号在已经在别处登录，请重新登录"){
                    alertService.showAlert("该手机号码和司机账号在已经在别处登录");
                    $state.transitionTo('signin');
                }
                $scope.DriverBillList=data;


            });
        };

        try{
            $scope.GetDriverData();
        }catch(ex)
        {

        }
        setInterval(function() {
            if($rootScope.autoCheck==false) return;
            try{
                $scope.GetDriverData();
            }catch(ex)
            {

            }

        }, 30000);
        $scope.isPlayMusic=false;
        $scope.checkUnConfirm=function(){
            $scope.isPlayMusic=false;
            if($scope.DriverBillList==null) return;
            if($scope.DriverBillList.length>0){
                for(var i=0;i<$scope.DriverBillList.length;i++){
                    if($scope.DriverBillList[i].sStatus=='已派车未确认')
                    {
                        $scope.isPlayMusic=true;
                        break;
                    }
                }
            }
        };

        try{
            $cordovaNativeAudio
                .preloadComplex('music', 'img/complete.wav', 1, 1)
                .then(function (msg) {

                }, function (error) {

                });
        }catch (ex)
        {

        }


        setInterval(function() {
            if($rootScope.autoCheck==false) return;
            try{
                $scope.checkUnConfirm();
                if($scope.isPlayMusic){
                    //  $cordovaNativeAudio.loop('music');
                    $cordovaNativeAudio.play('music');
                }
                else{
                    $cordovaNativeAudio.stop('music');
                }

            }catch(ex)
            {
                //alertService.showAlert(ex);
            }

        }, 3000);

        $scope.confirm=function(Applicant_ID){
            $scope.isPlayMusic=false;
            var paras= commonServices.getBaseParas();
            paras.Applicant_ID=Applicant_ID;

            var url=commonServices.getUrl("MilkTruckService.ashx","DriverSubmitConfirm");
            commonServices.submit(paras, url).then(function (data) {
                if (data.success) {
                    alertService.showAlert('确认成功！');
                    $scope.GetDriverData();
                    $cordovaNativeAudio.stop('music');
                }
                else {
                    alertService.showAlert(data.message);
                }
            });
        };

        $scope.LoginOut=function(Applicant_ID){
            var paras= commonServices.getBaseParas();
            var url=commonServices.getUrl("MilkTruckService.ashx","LoginOut");
            commonServices.submit(paras, url).then(function (data) {
                if (data.success) {
                    $rootScope.autoCheck=false;
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    $state.go('signin',{},{reload:true});
                }
                else {
                    alertService.showAlert(data.message);
                }
            });
        };


    })
    .controller('BandingCarNoCtrl', function($scope,$rootScope,$location,$ionicLoading,commonServices,alertService,CacheFactory,$ionicHistory,$state) {
        $scope.UserInfo= {
            CarNo:null,
            SecurityCode:null
        };
        var parameter=null;
        var url=commonServices.getUrl("MilkTruckService.ashx","GetCarNo");
        commonServices.getDataListNoMask(parameter,url).then(function(data){
            $scope.listCarNo=data;
        });
        $scope.carNoUpdate = function () {


        };
        $scope.closePass = function () {
            $location.path('signin');
        };

        $scope.btnText="获取验证码";
        $scope.getSecurityCode=function(UserInfo){



            var strCarNo= $("#selCarNo").find("option:selected").text();
            var url=commonServices.getUrl("MilkTruckService.ashx","GetSecurityCode");
            commonServices.getData({CarNo:strCarNo},url).then(function(data){
                if(data=="Token is TimeOut"){
                    alertService.showAlert("Token is TimeOut");
                    $state.transitionTo('signin');
                }
                var oBtn = document.getElementById('btnSecurity');
                oBtn.disabled=true;
                var i=60;
                $ionicLoading.show({ template: '已发送验证码到登记的手机号码上！', noBackdrop: true, duration: 2000 });
                var id= setInterval(function(){
                    i=i-1;
                    $scope.$apply(function(){
                        $scope.btnText=i+'秒后重新获取';
                    });

                    if(i==0){
                        $scope.$apply(function(){
                            $scope.btnText='获取验证码';
                        });
                        oBtn.disabled=false;
                        clearInterval(id);
                    };
                },1000);//1000为1秒钟
            });
        };


        $scope.checkSecurityCode=function(passmodels){

            try{
                if ( $scope.UserInfo.CarNo==null) {
                    alertService.showAlert('请选择一个车牌');
                    return false;
                }

                var paras={CarNo:$scope.UserInfo.CarNo.CarNo,SecurityCode:$scope.UserInfo.SecurityCode};
                var url=commonServices.getUrl("MilkTruckService.ashx","CheckSecurityCode");
                commonServices.submit(paras, url).then(function (response){
                    if (response.success) {
                        alertService.showLoading( "绑定成功！");
                        CacheFactory.remove('CarNo');
                        CacheFactory.save('CarNo',$scope.UserInfo.CarNo);
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        $state.go('signin',{},{reload:true});
                    }
                    else  {
                        alertService.showAlert( response.message);
                    }
                });



            }catch(e)
            {
                alertService.showAlert( e.message);
            }


        }




    })
    .controller('AccountCtrl', function($scope,$rootScope,$location,$state,$cordovaAppVersion,$ionicHistory,CacheFactory) {

        $cordovaAppVersion.getVersionNumber().then(function (version) {
            $scope.version= version;
        });

        // 退出
        $scope.signOut = function () {
//            CacheFactory.remove('accessToken');
//            CacheFactory.remove('accessDriver');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $location.path('signin');
            //$state.go("signin");

        };
        $scope.quit = function () {
            ionic.Platform.exitApp();
        }


    })
;
