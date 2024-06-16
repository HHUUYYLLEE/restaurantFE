export const saveAccessTokenToLS = (access_token) => {
  localStorage.setItem('access_token', access_token)
}

export const saveInfoToLS = (info) => {
  const json = JSON.stringify(info)
  localStorage.setItem('keyInfo', json)
}

export const clearAccessTokenFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('keyInfo')
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || null

export const getInfoFromLS = () => {
  if (
    localStorage.getItem('keyInfo') !== 'undefined' &&
    localStorage.getItem('keyInfo') !== 'null'
  ) {
    const objectInfo = JSON.parse(localStorage.getItem('keyInfo'))
    return objectInfo
  } else {
    localStorage.removeItem('keyInfo')

    return null
  }
}
