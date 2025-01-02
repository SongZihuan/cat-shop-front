import { LocationQueryRaw, RouteLocationNormalizedLoaded, Router } from 'vue-router'

const baseDeleteQuery = ['oldRecordId', 'nowRecordId']

const pushTo = (
  router: Router,
  route: RouteLocationNormalizedLoaded,
  path: string,
  newQuery: LocationQueryRaw = {},
  deleteNewQueryArray: string[] = [],
  deleteQueryArray: string[] = []
) => {
  if (!path) {
    path = '/admin'
  }

  const oldQuery = {
    ...route.query
  }

  baseDeleteQuery.forEach((item) => {
    oldQuery?.[item] && delete oldQuery[item]
  })

  deleteNewQueryArray &&
    deleteNewQueryArray.forEach((item) => {
      newQuery?.[item] && delete newQuery[item]
    })

  const query = {
    ...oldQuery,
    ...newQuery
  }

  deleteQueryArray &&
    deleteQueryArray.forEach((item) => {
      query?.[item] && delete query[item]
    })

  return router.push({
    path: path,
    query: query
  })
}

export default pushTo
