// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { campaignUpdate } from '../../actions/campaign'
import TimezoneDropdown from '../timezones/TimeZoneDropdown'
import TextField from 'react-md/lib/TextFields'
import SelectField from 'react-md/lib/SelectFields'
import RetryAttemptsField from '../RetryAttemptsField'
import TimeDropdown from '../TimeDropdown'
import SelectionControl from 'react-md/lib/SelectionControls'

type Props = {
  monitorDuration: number,
  retryAfter: string,
  retryAfterHours: boolean,
  retryConfig: string,
  retryMode: string,
  timezone: string,
  children: Node,

  onEditMonitorDuration: (monitorDuration: number) => void,
  onEditRetryConfig: (retryConfig: string) => void,
  onRetryAfterChange: (retryAfter: string) => void,
  onRetryAfterHoursChange: (retryAfterHours: boolean) => void,
  onRetryModeChange: (retryMode: string) => void,
  onEditTimezone: (timezone: string) => void,
}
class MonitoringSettingsComponent extends Component {
  props: Props

  render() {
    return (
      <section id='monitoring'>
        <div className='md-grid'>
          <div className='md-cell md-cell--12'>
            <h1>Set up monitoring settings</h1>
            <p>
              Define the number of days on which care subjects will be monitored, the interval between calls and call times.
            </p>
          </div>
        </div>
        <div className='md-grid'>
          <div className='md-cell md-cell--12'>
            <SelectField
              id='retry-mode-select'
              menuItems={[{value: 'sms', label: 'Remind subjects with an SMS'}, {value: 'ivr', label: 'Remind subjects with a phone call'}]}
              className='md-cell md-cell--6 md-cell--bottom'
              value={this.props.retryMode || ''}
              onChange={this.props.onRetryModeChange}
            />
            <span className='md-cell md-cell--4 md-cell--middle md-inline-block text-between-controls'>if contacts didn't check-in by</span>
            <TimeDropdown id='retry-after-select' value={this.props.retryAfter || ''} onChange={this.props.onRetryAfterChange} />
          </div>
        </div>
        <div className='md-grid'>
          <div className='md-cell md-cell--12'>
            <SelectionControl
              id='retry-after-hours-control'
              name='retry-after-hours-control'
              label="Don't send reminders after hours"
              type='checkbox'
              value={this.props.retryAfterHours || false}
              onChange={this.props.onRetryAfterHoursChange}
            />
          </div>
        </div>
        <div className='md-grid'>
          <div className='md-cell md-cell--12'>
            <RetryAttemptsField retryConfig={this.props.retryConfig} mode={this.props.retryMode} onChange={this.props.onEditRetryConfig} />
          </div>
        </div>
        <div className='md-grid'>
          <div className='md-cell md-cell--12'>
            <TimezoneDropdown selected={this.props.timezone || ''} onEdit={this.props.onEditTimezone} />
          </div>
        </div>
        <div className='md-grid'>
          <div className='md-cell md-cell--3'>
            <TextField label='Duration' id='monitor-duration' value={this.props.monitorDuration || ''} type='number' min={0} step={1} onChange={this.props.onEditMonitorDuration} rightIcon={<span>days</span>} />
          </div>
        </div>
        <div className='md-grid'>
          <div className='md-cell md-cell--12'>
            {this.props.children}
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    timezone: state.campaign.data.timezone,
    retryConfig: state.campaign.data.retryConfig,
    retryMode: state.campaign.data.retryMode,
    retryAfter: state.campaign.data.retryAfter,
    retryAfterHours: state.campaign.data.retryAfterHours,
    monitorDuration: state.campaign.data.monitorDuration
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEditTimezone: (timezone) => dispatch(campaignUpdate({timezone: timezone})),
    onEditRetryConfig: (retryConfig) => dispatch(campaignUpdate({retryConfig: retryConfig})),
    onRetryModeChange: (retryMode) => dispatch(campaignUpdate({retryMode})),
    onRetryAfterChange: (retryAfter) => dispatch(campaignUpdate({retryAfter})),
    onRetryAfterHoursChange: (retryAfterHours) => dispatch(campaignUpdate({retryAfterHours})),
    onEditMonitorDuration: (monitorDuration) => dispatch(campaignUpdate({monitorDuration: Number.parseInt(monitorDuration) || null}))
  }
}

const MonitoringSettingsStep = connect(
  mapStateToProps,
  mapDispatchToProps
)(MonitoringSettingsComponent)

export default MonitoringSettingsStep
