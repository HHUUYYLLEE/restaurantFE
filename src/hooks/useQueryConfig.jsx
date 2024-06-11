import omitBy from 'lodash/omitBy'

import { isUndefined } from 'lodash'
import useQueryParams from './useQueryParam'
export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 12,
      search: queryParams.search,
      mode: queryParams.mode || 1,
      address: queryParams.address,
      category: queryParams.category,
      sortByScore: queryParams.sortByScore,
      sortByPrice: queryParams.sortByPrice,
      chair: queryParams.chair,
      table: queryParams.table
    },
    isUndefined
  )
  return queryConfig
}
