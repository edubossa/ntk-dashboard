angular.module('admin.services.dashboard', [])
    .service('dashboardService', ['$log', '$http', '$q', '$window', function($log, $http, $q, $window) {
        $log.debug("- DashboardService LOADED");
        return {
            getTransactions: function(type) {
                $log.debug("getTransactions type --> " +  type);
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://payreportdemo.ntk.com.br:53680/api/AutoCom/GetTransacaoPorTecnologia',
                    headers: {
                        'Authorization': 'Basic dmljdG9yLmR1YXJ0ZUBudGsuY29tLmJyOnZpY3Rvcg==',
                    },
                    params: {
                        'pessoaId': '3502',
                        'tecnologiaId': '4828334,4828335,4828336,4828337,4828328,4828328',
                        'dataIni' : '10/01/2015',
                        'dataFim' : '10/01/2019'
                    }
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                /*var trConciliadas = [
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

                deferred.resolve(trConciliadas);*/
                return deferred.promise;
            },
            getTrAdquirentesTipo: function() {
                $log.debug("id_analytics called...");
                var analytics = JSON.parse(localStorage.getItem("ID_ANALYTICS"));
                if (analytics) {
                    return analytics;
                }
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: '/analytics/id'
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }
        }
}]);
