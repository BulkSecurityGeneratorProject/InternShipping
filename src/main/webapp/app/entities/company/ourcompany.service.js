(function() {
    'use strict';
    angular
        .module('internShippingApp')
        .factory('OurCompany', Company);

    Company.$inject = ['$resource'];

    function Company ($resource) {
        var resourceUrl =  'api/ourcompany/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
