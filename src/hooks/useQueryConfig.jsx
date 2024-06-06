import omitBy from 'lodash/omitBy'

import { isUndefined } from 'lodash'
import useQueryParams from './useQueryParam'
export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      search: queryParams.search,
      address: queryParams.address
    },
    isUndefined
  )
  return queryConfig
}
