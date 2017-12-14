// @flow
import * as api from '../api'
import type { Items, Dispatch, GetState } from '../types'

export const RECEIVE = 'CAMPAIGNS_RECEIVE'
export const RECEIVE_ERROR = 'CAMPAIGNS_RECEIVE_ERROR'
export const FETCH = 'CAMPAIGNS_FETCH'

export const fetchCampaigns = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()

  if (state.campaigns.fetching) {
    return
  }

  dispatch(startFetchingCampaigns())
  return api.fetchCampaigns()
            .then(response => dispatch(receiveCampaigns(response || {})))
}

export const startFetchingCampaigns = () => ({
  type: FETCH
})

export const receiveCampaigns = (items: Items) => ({
  type: RECEIVE,
  items
})
