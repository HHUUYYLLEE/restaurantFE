const envConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  deployURL: import.meta.env.VITE_DEPLOY_URL,
  googleClientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  opencageURL: import.meta.env.VITE_OPENCAGE_API,
  opencageKey: import.meta.env.VITE_OPENCAGE_KEY,
  graphhopperKey: import.meta.env.VITE_GRAPHHOPPER_API_KEY,
  graphhopperURL: import.meta.env.VITE_GRAPHHOPPER_API
}

const webName = 'vnFood'

export { envConfig, webName }
