// @flow
import * as actions from '../actions/campaign'
import * as symptomActions from '../actions/symptoms'

const initialState = {
  fetching: false,
  campaignId: null,
  data: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CAMPAIGN_CREATED: return campaignLoaded(state, action)
    case actions.CAMPAIGN_FETCH: return campaignFetch(state, action)
    case actions.CAMPAIGN_FETCHED: return campaignLoaded(state, action)
    case actions.CAMPAIGN_UPDATED: return campaignLoaded(state, action)
    case symptomActions.EMPTY_SYMPTOM_ADD: return addEmptySymptom(state)
    default: return state
  }
}

const campaignFetch = (state, id) => {
  return { fetching: true, campaignId: id, data: null }
}

const campaignLoaded = (state, { campaign }) => {
  return { fetching: false, campaignId: campaign.id, data: campaign }
}

const addEmptySymptom = (state) => {
  let symptoms = state.data.symptoms || []
  return { ...state, data: { ...state.data, symptoms: [...symptoms,""] } }
}