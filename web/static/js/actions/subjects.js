// @flow
import * as api from '../api'
import type { Items, Dispatch, GetState } from '../types'

export const RECEIVE = 'SUBJECTS_RECEIVE'
export const RECEIVE_ERROR = 'SUBJECTS_RECEIVE_ERROR'
export const FETCH = 'SUBJECTS_FETCH'

export const fetchSubjects = (campaignId: number, limit: number, page: number) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()

  if (state.subjects.fetching) {
    return
  }

  dispatch(startFetchingSubjects())
  return api.fetchSubjects(campaignId, limit, page)
    .then(response => dispatch(receiveSubjects(response || {}, limit, page)))
}

export const startFetchingSubjects = () => ({
  type: FETCH
})

export const receiveSubjects = (items: Items, limit: number, page: number) => ({
  type: RECEIVE,
  items: items.subjects,
  count: items.count,
  limit,
  page
})
