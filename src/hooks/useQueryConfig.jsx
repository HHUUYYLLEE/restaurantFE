import omitBy from 'lodash/omitBy'

import { isUndefined } from 'lodash'
import useQueryParams from './useQueryParam'
export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      search: queryParams.search,
      address: queryParams.address
    },
    isUndefined
  )
  return queryConfig
}
