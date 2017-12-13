// @flow
import * as api from '../api'
import type { Items, Dispatch, GetState } from '../types'

export const RECEIVE = 'SUBJECTS_RECEIVE'
export const RECEIVE_ERROR = 'SUBJECTS_RECEIVE_ERROR'
export const FETCH = 'SUBJECTS_FETCH'
export const PAGE_XXX = 'SUBJECTS_PAGE_XXX'

export const fetchSubjects = (campaignId: number, limit: number, page: number) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()

  dispatch(targetPage(page))
  if (state.subjects.fetching) {
    return
  }

  dispatch(startFetchingSubjects())
  return api.fetchSubjects(campaignId, limit, page)
            .then(response => {
              dispatch(receiveSubjects(response || {}, limit, page))
              let targetPage = getState().subjects.targetPage
              if (targetPage != page) {
                dispatch(fetchSubjects(campaignId, limit, targetPage))
              }
            })
}

export const targetPage = (page: number) => ({
  type: PAGE_XXX,
  page
})

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
