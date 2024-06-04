const envConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  deployURL: import.meta.env.VITE_DEPLOY_URL,
  googleClientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  opencageURL: import.meta.env.VITE_OPENCAGE_API,
  opencageKey: import.meta.env.VITE_OPENCAGE_KEY
}

const webName = 'NhaHang'
const minPrice = 0,
  defaultPriceRight = 4500000,
  minArea = 0,
  defaultAreaRight = 50,
  maxPrice = 20000000,
  maxArea = 100,
  stepPrice = 100000,
  stepArea = 1

export {
  envConfig,
  webName,
  minPrice,
  minArea,
  defaultAreaRight,
  defaultPriceRight,
  maxPrice,
  maxArea,
  stepArea,
  stepPrice
}
