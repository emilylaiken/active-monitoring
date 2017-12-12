import * as actions from '../actions/subjects'
import * as itemActions from '../actions/subject'
import collectionReducer, {defaultFilterProvider} from './collection'

const itemsReducer = (state) => state

const initialState = {
  editingSubject: null,
  fetching: false,
  items: null,
  count: 0,
  filter: null,
  order: null,
  sortBy: 'updated_at',
  sortAsc: false,
  page: {
    index: 0,
    size: 5
  }
}

const subjectEdit = (state, editingSubject) => (
  {
    ...state,
    editingSubject
  }
)

const subjectEditing = (state, fieldName, value) => (
  {
    ...state,
    editingSubject: {
      ...state.editingSubject,
      [fieldName]: value
    }
  }
)

const subjectCreated = (state, subject) => (
  {
    ...state,
    editingSubject: null,
    items: [...state.items, subject],
    count: state.count + 1
  }
)

const subjectsReducer = collectionReducer(actions, itemsReducer, defaultFilterProvider, initialState)

export default (state, action) => {
  switch (action.type) {
    case itemActions.SUBJECT_EDIT: return subjectEdit(state, action.subject)
    case itemActions.SUBJECT_EDITING: return subjectEditing(state, action.fieldName, action.value)
    case itemActions.SUBJECT_CREATED: return subjectCreated(state, action.subject)
    default: return subjectsReducer(state, action)
  }
}
