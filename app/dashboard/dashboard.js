'use strict';
angular.module('admin.dashboard', ['ngRoute', 'chart.js'])
    .controller('DashboardViewCtrl', ['$log', '$rootScope', '$scope', function($log, $rootScope, $scope) {
    $log.debug("-- DashboardViewCtrl LOADED");

    $scope._isLoadingPage = false;

    $scope.reports_conciliadas = [
        {
            "id" : 121,
            "title" : "Venda 01",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 122,
            "title" : "Venda 02",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 123,
            "title" : "Venda 03",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 124,
            "title" : "Venda 04",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 125,
            "title" : "Venda 05",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 126,
            "title" : "Venda 06",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 127,
            "title" : "Venda 07",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 128,
            "title" : "Venda 08",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 129,
            "title" : "Venda 09",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        },
        {
            "id" : 130,
            "title" : "Venda 10",
            "created_at" : "2017-06-23T10:41:45.257-03:00",
            "updated_at" : "2017-09-21T13:53:11.667-03:00",
        }
    ];


    //polling status
    var statusPollingTime = 5000;
    var statusPolling = function() {
        $log.debug("* status polling STARTED");

        /*sMerchant.getMerchantStatus().then(function successCallback(data) {
            $scope.switchStatusEc = data.merchant.is_open;
        }, function errorCallback(response) {
        }).finally(function() {
            $log.debug("* status polling ENDED");
            setTimeout(function() {
                if (typeof statusPolling === "function") statusPolling();
            }, statusPollingTime);
        });*/

        setTimeout(function() {
            if (typeof statusPolling === "function") statusPolling();
        }, statusPollingTime);

    }

    statusPolling();

    $scope.$on('$destroy', function() {
        statusPolling = null;
    });

    $scope.getDashboardInfo = function (periodo) {
        alert("Periodo -> " +  periodo);
    }


}]);
