(function() {
    'use strict';

    angular
        .module('internShippingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('application', {
            parent: 'entity',
            url: '/application?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'internShippingApp.application.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/application/applications.html',
                    controller: 'ApplicationController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('application');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        }).state('ourapplication', {
            parent: 'entity',
            url: '/ourapplication',
            data: {
                authorities: ['ROLE_COMPANY'],
                pageTitle: 'app/entities/application/applications.html'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/application/ourapplications.html',
                    controller: 'ApplicationController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('resume');
                    $translatePartialLoader.addPart('education');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('application-detail', {
            parent: 'entity',
            url: '/application/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'internShippingApp.application.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/application/application-detail.html',
                    controller: 'ApplicationDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('application');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Application', function($stateParams, Application) {
                    return Application.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('application.new', {
            parent: 'application',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/application/application-dialog.html',
                    controller: 'ApplicationDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'xlg',
                    resolve: {
                        entity: function () {
                            return {
                                marked: null,
                                id: null,
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('application', null, { reload: true });
                }, function() {
                    $state.go('application');
                });
            }]
        })
        .state('application.edit', {
            parent: 'application',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/application/application-dialog.html',
                    controller: 'ApplicationDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Application', function(Application) {
                            return Application.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('application', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        }).state('application.apply', {
                parent: 'job',
                url: '/{id}/apply',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/application/application-dialog.html',
                        controller: 'ApplicationDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'xlg',
                        resolve: {
                            entity: function () {
                                return {
                                    marked: null,
                                    id: null,
                                    jobId: parseInt($stateParams.id)
                                };
                            }
                        }
                    }).result.then(function() {
                        $state.go('application', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
         })
        .state('application.delete', {
            parent: 'application',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/application/application-delete-dialog.html',
                    controller: 'ApplicationDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Application', function(Application) {
                            return Application.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('application', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
