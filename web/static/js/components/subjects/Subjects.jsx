// @flow
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'
import { push } from 'react-router-redux'
import Card from 'react-md/lib/Cards/Card'
import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import TablePagination from 'react-md/lib/DataTables/TablePagination'

import * as collectionActions from '../../actions/subjects'
import * as itemActions from '../../actions/subject'
import EmptyListing from '../EmptyListing'
import SubNav from '../SubNav'
import type { Subject } from '../../types'

class SubjectsList extends Component {
  handlePagination() {
    debugger
  }

  render() {
    const subjects = this.props.items || []

    if (subjects.length == 0) {
      return (
        <EmptyListing image='/images/person.svg'>
          <h5>You have no subjects on this project</h5>
          <NavLink to='#' onClick={this.props.createSubject}>Add subjects</NavLink>
        </EmptyListing>
      )
    }

    return (
      <div className='md-grid'>
        <div className='md-cell md-cell--12'>
          <Card tableCard>
            <DataTable plain className='app-listing'>
              <TableHeader>
                <TableRow>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Role</TableColumn>
                  <TableColumn>Last Activity</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                { subjects.map(s => <SubjectItem key={s.id} subject={s} onClick={this.props.onSubjectClick} />) }
              </TableBody>
              <TablePagination
                baseId='subjects-pagination'
                rows={this.props.count}
                defaultRowsPerPage={1}
                rowsPerPageLabel='Rows per page'
                rowsPerPage={1}
                rowsPerPageItems={[1, 10, 25, 50]}
                page={1}
                onPagination={this.handlePagination}
              />
            </DataTable>
          </Card>
        </div>
      </div>
    )
  }
}

// SubjectsList.propTypes = {
//   createSubject: PropTypes.func.isRequired,
//   onSubjectClick: PropTypes.func.isRequired,
//   items: PropTypes.array
// }

class SubjectItem extends Component {
  campaignName() {
    let name = this.props.campaign.name || ''
    if (name == '') {
      return <em>Untitled Campaign #{this.props.campaign.id}</em>
    }
    const nameMaxLength = 120
    if (name.length > nameMaxLength) {
      return `${name.slice(0, nameMaxLength - 3)}...`
    }
    return name
  }

  render() {
    const subject = this.props.subject
    return (
      <TableRow onClick={() => this.props.onClick(subject.id)}>
        <TableColumn>{subject.phoneNumber}</TableColumn>
        <TableColumn>...</TableColumn>
      </TableRow>
    )
  }
}

// SubjectItem.propTypes = {
//   subject: PropTypes.shape({
//     phoneNumber: PropTypes.string,
//     id: PropTypes.number
//   }).isRequired,
//   onClick: PropTypes.func.isRequired
// }

class Subjects extends Component {
  props: {
    campaignId: number,
    subjects: {
      count: number,
      items: Subject[]
    },
    collectionActions: {
      fetchSubjects: (campaignId: number) => void
    },
    itemActions: {
      createSubject: (campaignId: number) => void
    },
    navigate: (url: string) => void,
  }

  componentWillMount() {
    this.props.collectionActions.fetchSubjects(this.props.campaignId)
  }

  createSubject() {
    this.props.itemActions.createSubject(this.props.campaignId)
  }

  goToSubject(id) {
    const campaignId = this.props.campaignId
    this.props.navigate(`/campaigns/${campaignId}/subjects/${id}`)
  }

  pageTitle() {
    return 'Campaigns!'
  }

  render() {
    return (
      <div className='md-grid--no-spacing'>
        <SubNav addButtonHandler={() => this.createSubject()}>
          Campaigns
        </SubNav>
        <SubjectsList
          items={this.props.subjects.items}
          count={this.props.subjects.count}
          createSubject={() => this.createSubject()}
          onSubjectClick={(id) => this.goToSubject(id)} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  campaignId: parseInt(ownProps.match.params.campaignId),
  subjects: state.subjects
})

const mapDispatchToProps = (dispatch) => ({
  collectionActions: bindActionCreators(collectionActions, dispatch),
  itemActions: bindActionCreators(itemActions, dispatch),
  navigate: (path) => dispatch(push(path))
})

export default connect(mapStateToProps, mapDispatchToProps)(Subjects)
