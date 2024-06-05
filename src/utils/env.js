const envConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  deployURL: import.meta.env.VITE_DEPLOY_URL,
  googleClientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  opencageURL: import.meta.env.VITE_OPENCAGE_API,
  opencageKey: import.meta.env.VITE_OPENCAGE_KEY
}

const webName = 'NhaHang'
const minPrice = 0

export { envConfig, webName }
