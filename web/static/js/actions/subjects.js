// @flow
import * as api from '../api'
import type { Items, Dispatch, GetState } from '../types'

export const RECEIVE = 'SUBJECTS_RECEIVE'
export const RECEIVE_ERROR = 'SUBJECTS_RECEIVE_ERROR'
export const FETCH = 'SUBJECTS_FETCH'

export const fetchSubjects = (campaignId: number) => (dispatch: Dispatch, getState: GetState) => {
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

export const receiveSubjects = (items: Items) => ({
  type: RECEIVE,
  items: items.subjects,
  count: items.count
})
