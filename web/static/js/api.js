import 'isomorphic-fetch'

export class Unauthorized {
  constructor(response) {
    this.response = response
  }
}

const apiFetch = (url, options) => {
  return fetch(`/api/v1/${url}`, { ...options, credentials: 'same-origin' })
    .then(response => {
      return handleResponse(response, () =>
        response)
    })
}

const apiFetchJSON = (url, options) => {
  return apiFetchJSONWithCallback(url, options, commonCallback)
}

const apiFetchJSONWithCallback = (url, options, responseCallback) => {
  return apiFetch(url, options)
    .then(response => {
      if (response.status == 204) {
        // HTTP 204: No Content
        return { json: null, response }
      } else {
        return response.json().then(json => ({ json, response }))
      }
    })
    .then(({ json, response }) => {
      return handleResponse(response, responseCallback(json))
    })
}

const commonCallback = (json) => {
  return () => {
    if (!json) { return null }
    if (json.errors) {
      console.log(json.errors)
    }
    return json.data
  }
}

const handleResponse = (response, callback) => {
  if (response.ok) {
    return callback()
  } else if (response.status == 401 || response.status == 403) {
    return Promise.reject(new Unauthorized(response.statusText))
  } else {
    return Promise.reject(response)
  }
}

// const apiPutOrPostJSON = (url, verb, body) => {
//   const options = {
//     method: verb,
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     }
//   }
//   if (body) {
//     options.body = JSON.stringify(body)
//   }
//   return apiFetchJSON(url, options)
// }
//
// const apiPostJSON = (url, body) => {
//   return apiPutOrPostJSON(url, 'POST', body)
// }
//
// const apiPutJSON = (url, body) => {
//   return apiPutOrPostJSON(url, 'PUT', body)
// }

const apiDelete = (url) => {
  return apiFetch(url, {method: 'DELETE'})
}

export const logout = () => {
  apiDelete('sessions').then(() => { window.location.href = '/' })
}

export const fetchCampaigns = () => {
  return apiFetchJSON('campaigns')
}