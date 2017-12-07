import * as api from '../api'

export const RECEIVE = 'SUBJECTS_RECEIVE'
export const RECEIVE_ERROR = 'SUBJECTS_RECEIVE_ERROR'
export const FETCH = 'SUBJECTS_FETCH'

export const fetchSubjects = (campaignId) => (dispatch, getState) => {
  const state = getState()

  if (state.subjects.fetching) {
    return
  }

  dispatch(startFetchingSubjects())
  return api.fetchSubjects(campaignId)
            .then(response => dispatch(receiveSubjects(response || {})))
}

export const startFetchingSubjects = () => ({
  type: FETCH
})

export const receiveSubjects = (items) => ({
  type: RECEIVE,
  items: items.subjects,
  count: items.count
})
