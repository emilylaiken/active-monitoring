import * as api from '../api'
import { SERVER_ERROR } from './shared'
import { push } from 'react-router-redux'
import assign from 'lodash/assign'

export const SUBJECT_CREATE = 'SUBJECT_CREATE'
export const SUBJECT_CREATED = 'SUBJECT_CREATED'
export const SUBJECT_FETCH = 'SUBJECT_FETCH'
export const SUBJECT_FETCHED = 'SUBJECT_FETCHED'
export const SUBJECT_UPDATE = 'SUBJECT_UPDATE'
export const SUBJECT_UPDATED = 'SUBJECT_UPDATED'
export const SUBJECT_LAUNCH = 'SUBJECT_LAUNCH'

export const createSubject = (campaignId, subjectParams) => (dispatch) => {
  dispatch({type: SUBJECT_CREATE})
  const defaultProps = { }
  const params = assign({}, defaultProps, subjectParams)

  api.createSubject(campaignId, params)
     .then((subject) => {
       dispatch(subjectCreated(subject))
       dispatch(push(`/campaigns/${campaignId}/subjects/${subject.id}`))
     })
}

export const subjectCreated = (subject) => {
  return { type: SUBJECT_CREATED, subject }
}

export const subjectFetch = (id) => (dispatch) => {
  dispatch({type: SUBJECT_FETCH, id: id})

  api.fetchSubject(id)
    .then((subject) => {
      dispatch({ type: SUBJECT_FETCHED, subject: subject })
    })
}

export const subjectUpdate = (attrs) => (dispatch, getState) => {
  const newSubject = assign({}, getState().subject.data, attrs)

  dispatch({type: SUBJECT_UPDATED, subject: newSubject})
  api.updateSubject(newSubject)
    .catch((message) => {
      dispatch({type: SERVER_ERROR, message})
    })
}

export const subjectUpdated = (subject) => {
  return { type: SUBJECT_UPDATED, subject }
}
