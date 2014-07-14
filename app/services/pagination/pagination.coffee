angular.module('app').factory 'Pagination', ($location, $rootScope) ->
  new class Pagination
    constructor: (@perPage = 50) ->
      @page = parseInt($location.search().page) || 1

    numItems: (@num) ->
      if @num?
        @numPages = Math.ceil(num / @perPage)

    reset: ->
      $location.search('page', null)
      @page = 1
      @numPages = undefined

    setPage: (page) ->
      if 1 <= page <= @numPages and page isnt @page
        $location.search('page', page)
        @page = page
        $rootScope.$broadcast('pageChange', page: page)

    prevPage: ->
      @setPage(@page - 1)

    nextPage: ->
      @setPage(@page + 1)

    pageList: ->
      list = []
      list.push 1 if @page > 6
      list.push '...' if @page > 7
      list.push i for i in [Math.max(1, @page - 5)..Math.min(@numPages, @page + 6)]
      list.push '...'  if (@numPages - @page) > 7
      list.push @numPages if (@numPages - @page) > 6
      list

    offset: ->
      if @page?
        (@page - 1) * @perPage
      else
        0
