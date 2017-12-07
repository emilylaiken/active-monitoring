import * as actions from '../actions/subjects'
import collectionReducer, {defaultFilterProvider} from './collection'

const itemsReducer = (state) => state

const initialState = {
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

export default collectionReducer(actions, itemsReducer, defaultFilterProvider, initialState)
