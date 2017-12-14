// @flow
import React, { Component } from 'react'
import { fetchTimezones } from '../../actions/timezones'
import { formatTimezone } from './util'
import SelectField from 'react-md/lib/SelectFields'
import { connect } from 'react-redux'
import type { Dispatch } from '../../types'

type Props = {
  timezones: {
    items: string[] // eslint-disable-line react/no-unused-prop-types
  },
  selected: string,
  readOnly?: boolean,
  onEdit: (timezone: string) => void,
  dispatch: Dispatch,
}

class TimezoneDropdown extends Component {
  props: Props

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchTimezones())
  }

  render() {
    const { timezones, selected, onEdit, readOnly } = this.props

    if (!timezones || !timezones.items) {
      return (
        <div>Loading timezones...</div>
      )
    }

    const timezonesWithFormat = timezones.items.map((timezone) => ({value: timezone, label: formatTimezone(timezone)}))

    return (
      <SelectField
        id='timezone'
        label='Timezone'
        menuItems={timezonesWithFormat}
        className='md-cell md-cell--8  md-cell--bottom'
        value={selected}
        onChange={onEdit}
        readOnly={readOnly}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  timezones: state.timezones
})

export default connect(mapStateToProps)(TimezoneDropdown)
