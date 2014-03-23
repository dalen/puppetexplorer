angular.module("app").controller "DashboardCtrl", ($scope, PuppetDB) ->
  getBean = (name, scope, multiply = 1, bean = 'com.puppetlabs.puppetdb.query.population') ->
    PuppetDB.query("metrics/mbean/#{bean}:type=default,name=#{name}")
    .success (data) ->
      $scope[scope] = (angular.fromJson(data).Value * multiply)
        .toLocaleString()
        .replace(/^(.*\..).*/, "$1")
    .error (data) ->
      console?.log "Could not get #{name} from PuppetDB"

  getBean('num-nodes', 'activeNodes')
  getBean('num-resources', 'resources')
  getBean('avg-resources-per-node', 'avgResources')
  getBean('pct-resource-dupes', 'resDuplication', 100)
