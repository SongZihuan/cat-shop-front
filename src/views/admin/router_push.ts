import { LocationQueryRaw, RouteLocationNormalizedLoaded, Router } from 'vue-router'

const baseDeleteOldQuery: string[] = []

const pushTo = (
  router: Router,
  route: RouteLocationNormalizedLoaded,
  path: string,
  newQuery: LocationQueryRaw = {},
  deleteNewQueryArray: string[] = [],
  deleteOldQueryArray: string[] = [],
  deleteQueryArray: string[] = []
) => {
  if (!path) {
    path = '/admin'
  }

  const oldQuery = {
    ...route.query
  }

  baseDeleteOldQuery.forEach((item) => {
    oldQuery?.[item] && delete oldQuery[item]
  })

  deleteOldQueryArray &&
    deleteOldQueryArray.forEach((item) => {
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
