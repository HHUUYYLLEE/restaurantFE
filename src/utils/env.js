const envConfig = {
  deployURL:
    import.meta.env.VITE_OPTION === '1'
      ? import.meta.env.VITE_LOCAL_URL
      : import.meta.env.VITE_CLOUD_URL,
  googleClientID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  opencageURL: import.meta.env.VITE_OPENCAGE_API,
  opencageKey: import.meta.env.VITE_OPENCAGE_KEY,
  graphhopperKey: import.meta.env.VITE_GRAPHHOPPER_API_KEY,
  graphhopperURL: import.meta.env.VITE_GRAPHHOPPER_API
}

const webName = 'vnFood'

export { envConfig, webName }
