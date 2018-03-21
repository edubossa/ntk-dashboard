'use strict';
angular.module('admin', [
    'ngRoute',
    'admin.dashboard',
    'ngAnimate'
]).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.when('/', {
            redirectTo: '/home'
        }).when('/home', {
        }).when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardViewCtrl'
        }).otherwise({
            templateUrl: 'template/404.html'
        });
    }]).config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(true);
}]).controller('AppCtrl', ['$rootScope', '$scope', '$location', '$window', '$http', '$timeout', '$interval', function($rootScope, $scope, $location, $window, $http, $timeout, $interval) {
    $rootScope.system = {
        "currentTime": moment().locale('pt-br').format('L LTS'),
        "currency": "R$",
        "apiURL": ''
    }
    $rootScope.$on('$locationChangeStart', function(event, next) {
        $location.path("/dashboard");
        $rootScope.system.currentTime = moment().locale('pt-br').format('L LTS');
        // fix when back with model open
        $(".modal-backdrop").remove();
        // clear toastr
        toastr.clear();
    });
    $rootScope.converteGatePrice = function(input, separator) { //OBS: campos separator nao sera mais utilizado
        try {
            if (isNaN(input)) throw 'isNaN';
            var retorno = input / 100;
            var numero = retorno.toFixed(2).split('.');
            numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
            return numero.join(',');
        } catch (err) {
            return '';
        }
    }
    $rootScope.converteDocumento = function(documento) {
        try {
            var documentoFormatado = goodString(documento);
            documentoFormatado = documentoFormatado.replace(/\D/g, "");
            if (documentoFormatado.length == 11) { //caso CPF
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                return documentoFormatado;
            }
            if (documentoFormatado.length == 14) { //caso CNPJ
                documentoFormatado = documentoFormatado.replace(/(\d{2})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1.$2");
                documentoFormatado = documentoFormatado.replace(/(\d{3})(\d)/, "$1/$2");
                documentoFormatado = documentoFormatado.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
                return documentoFormatado;
            }
            return goodString(documento);
        } catch (err) {
            return documento;
        }
    }
    $rootScope.converteTelefone = function(telefone) {
        try {
            var telefoneFormatado = goodString(telefone);
            telefoneFormatado = telefone.replace(/\D/g, "");
            if (telefoneFormatado.length == 10) { //8 digitos
                telefoneFormatado = telefoneFormatado.replace(/(\d{2})(\d)/, "($1) $2");
                telefoneFormatado = telefoneFormatado.replace(/(\d{4})(\d)/, "$1-$2");
                return telefoneFormatado;
            }
            if (telefoneFormatado.length == 11) { //9 digitos
                telefoneFormatado = telefoneFormatado.replace(/(\d{2})(\d)/, "($1) $2");
                telefoneFormatado = telefoneFormatado.replace(/(\d{5})(\d)/, "$1-$2");
                return telefoneFormatado;
            }
            return goodString(telefone);
        } catch (err) {
            return telefone;
        }
    }
    $rootScope.padZero = function(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }
    $rootScope.moment = function(value) {
        if (value == undefined) return "";
        return moment(value).locale('pt-br').format('L LTS');
    }
    $rootScope.momentDate = function(value) {
        if (value == undefined) return "";
        return moment(value).format('DD/MM/YYYY');
    }
}]).factory('focus', ['$timeout', '$window', function($timeout, $window) {
    return function(id) {
        var element = $window.document.getElementById(id);
        if (element) element.focus();
        $timeout(function() {
            if (element) element.focus();
        }, 500);
    };
}]).directive('eventFocus', ['focus', function(focus) {
    return function(scope, elem, attr) {
        elem.on(attr.eventFocus, function() {
            focus(attr.eventFocusId);
        });
        scope.$on('$destroy', function() {
            elem.off(attr.eventFocus);
        });
    };
}]).filter('sumByKey', function() {
    return function(data, key) {
        if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseInt(data[i][key]);
        }
        return sum;
    };
});
var nodeAuthenticateURL = '/api/authenticate';