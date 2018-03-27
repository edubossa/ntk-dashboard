angular.module('admin.services.dashboard', [])
    .service('dashboardService', ['$log', '$http', '$q', '$window', function($log, $http, $q, $window) {
        $log.debug("- DashboardService LOADED");
        return {
            getTransactions: function(type, tecnologiaId) {
                $log.debug("getTransactions type --> " +  type);

                var dataIni  = moment().subtract(30, "days").format('YYYY-MM-DD');
                var dataFim = moment().format('YYYY-MM-DD');

                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://payreportdemo.ntk.com.br:53680/api/AutoCom/GetTransacaoConciliacaoPorTecnologia',
                    headers: {
                        'Authorization': 'Basic dmljdG9yLmR1YXJ0ZUBudGsuY29tLmJyOnZpY3Rvcg==',
                    },
                    params: {
                        'pessoaId': '3504',
                        'tecnologiaId': tecnologiaId,
                        'tecnologiaTipoId' : '3,4',
                        'dataIni' : dataIni,
                        'dataFim' : dataFim,
                        'conciliada' : type
                    }
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getTrAdquirentesTipo: function(tecnologiaId) {
                $log.debug("getTrAdquirentesTipo");

                var dataIni  = moment().subtract(30, "days").format('YYYY-MM-DD');
                var dataFim = moment().format('YYYY-MM-DD');

                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://payreportdemo.ntk.com.br:53680/api/AutoCom/GetTransacaoPorTipo',
                    headers: {
                        'Authorization': 'Basic dmljdG9yLmR1YXJ0ZUBudGsuY29tLmJyOnZpY3Rvcg==',
                    },
                    params: {
                        'pessoaId': '3504',
                        'tecnologiaId': tecnologiaId,
                        'dataIni' : dataIni,
                        'dataFim' : dataFim
                    }
                }).then(function successCallback(response) {
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            }
        }
}]);
