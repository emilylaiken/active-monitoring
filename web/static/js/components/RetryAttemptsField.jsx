// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import TextField from 'react-md/lib/TextFields'

type Props = {
  retryConfig: string,
  mode: string,
  onChange: (retryConfig: string) => void,
}

export class RetryAttemptsField extends Component {
  props: Props

  replaceTimeUnits(value: string) {
    let formattedValue = value
    formattedValue = formattedValue.replace('m', ' minutes')
    formattedValue = formattedValue.replace('h', ' hours')
    formattedValue = formattedValue.replace('d', ' days')
    return formattedValue
  }

  retryConfigurationFlow(retriesValue: string, mode: string) {
    if (retriesValue) {
      let values = retriesValue.split(' ')
      values = values.filter((v) => v)
      values = values.filter((v) => /^\d+[mhd]$/.test(v))
      return (
        <ul className={`${mode}-attempts`}>
          <li className='black-text'><i className='material-icons v-middle'>{this.icon(mode)}</i>Initial contact </li>
          {values.map((v, i) =>
            <li key={`${mode}${v}${i}`}><span>{this.replaceTimeUnits(v)}</span></li>
          )}
        </ul>
      )
    }
  }

  icon(mode: string) {
    if (mode == 'sms') {
      return 'sms'
    }

    if (mode == 'ivr') {
      return 'phone'
    }

    throw new Error(`unknown mode: ${mode}`)
  }

  label(mode: string) {
    if (mode == 'sms') {
      return 'SMS re-contact attempts'
    }

    if (mode == 'ivr') {
      return 'Phone re-contact attempts'
    }

    throw new Error(`unknown mode: ${mode}`)
  }

  render() {
    const { retryConfig, mode, onChange } = this.props

    return (
      <div className='row'>
        <div className='input-field col s12'>
          <TextField label={this.label(mode)} id='retry-attempts' value={retryConfig || ''} onChange={onChange} />
          <span className='small-text-bellow'>
            Enter delays like <strong>5m 2h 1d</strong> to express time units
          </span>
          {this.retryConfigurationFlow(retryConfig, mode)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  survey: state.survey
})

export default connect(mapStateToProps)(RetryAttemptsField)
