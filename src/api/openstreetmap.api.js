import { mapInstance } from '../utils/http'
export const getSearchLocation = (params) => mapInstance.get('json', { params })
