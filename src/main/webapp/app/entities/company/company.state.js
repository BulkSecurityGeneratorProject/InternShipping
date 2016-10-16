(function() {
    'use strict';

    angular
        .module('internShippingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('company', {
            parent: 'entity',
            url: '/company?page&sort&search',
            data: {
                authorities: [],
                pageTitle: 'internShippingApp.company.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/company/companies.html',
                    controller: 'CompanyController',
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
                    $translatePartialLoader.addPart('company');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
            .state('ourcompany', {
                parent: 'entity',
                url: '/ourcompany',
                data: {
                    authorities: ['ROLE_COMPANY'],
                    pageTitle: 'internShippingApp.resume.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/company/ourcompany.html',
                        controller: 'CompanyController',
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
                        $translatePartialLoader.addPart('company');
                        $translatePartialLoader.addPart('education');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
        .state('company-detail', {
            parent: 'entity',
            url: '/company/{id}',
            data: {
                authorities: [],
                pageTitle: 'internShippingApp.company.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/company/company-detail.html',
                    controller: 'CompanyDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('company');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Company', function($stateParams, Company) {
                    return Company.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('company.new', {
            parent: 'company',
            url: '/new',
            data: {
                authorities: ['ROLE_USER'],
        		pageTitle: 'internShippingApp.company.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/company/company-dialog.html',
                    controller: 'CompanyDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: function () {
                    return {
                        logo: null,
                        logoContentType: null,
                        name: null,
                        domain: null,
                        shortDescription: null,
                        longDescription: null,
                        website: null,
                        contactEmail: null,
                        contactNumber: null,
                        companySize: null,
                        foundedYear: null,
                        socialFacebook: null,
                        socialLinkedin: null,
                        socialYoutube: null,
                        socialTwitter: null,
                        address: null,
                        id: null
                    };
                }
            }
        })
        .state('company.edit', {
            parent: 'company',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/company/company-dialog.html',
                    controller: 'CompanyDialogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams','Company', function($stateParams,Company) {
                    return Company.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('company.delete', {
            parent: 'company',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/company/company-delete-dialog.html',
                    controller: 'CompanyDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Company', function(Company) {
                            return Company.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('company', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
