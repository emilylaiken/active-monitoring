import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as actions from '../../actions/campaign'
import CampaignTitle from './CampaignTitle'
import Subheader from '../Subheader'
import CampaignCreationForm from './CampaignCreationForm'

class Campaign extends Component {
  componentWillMount() {
    const { campaignId, data } = this.props.campaign

    if (this.props.id != campaignId || !data) {
      this.props.actions.campaignFetch(this.props.id)
    }
  }

  render() {
    if (this.props.campaign.fetching || !this.props.campaign.data) {
      return <div />
    } else {
      return (
        <div>
          <Subheader>
            <CampaignTitle campaign={this.props.campaign.data} />
          </Subheader>
          <CampaignCreationForm />
        </div>
      )
    }
  }
}
// <SurveyForm survey={survey} respondentGroups={respondentGroups} respondentGroupsUploading={respondentGroupsUploading} respondentGroupsUploadingExisting={respondentGroupsUploadingExisting} invalidRespondents={invalidRespondents} invalidGroup={invalidGroup} projectId={projectId} questionnaires={questionnaires} channels={channels} dispatch={dispatch} questionnaire={questionnaire} readOnly={readOnly} />

Campaign.propTypes = {
  actions: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  campaign: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    id: parseInt(ownProps.match.params.id),
    campaign: state.campaign
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Campaign)