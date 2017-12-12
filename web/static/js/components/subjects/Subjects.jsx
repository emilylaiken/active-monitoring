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
import Dialog from 'react-md/lib/Dialogs'

import * as collectionActions from '../../actions/subjects'
import * as itemActions from '../../actions/subject'
import EmptyListing from '../EmptyListing'
import SubjectForm from './SubjectForm'
import SubNav from '../SubNav'
import type { Subject, SubjectParams } from '../../types'

class SubjectsList extends Component {
  props: {
    items: Subject[],
    showSubjectForm: () => void,
    onSubjectClick: (subject: Subject) => void
  }

  render() {
    const subjects = this.props.items || []

    if (subjects.length == 0) {
      return (
        <EmptyListing image='/images/person.svg'>
          <h5>You have no subjects on this project</h5>
          <NavLink to='#' onClick={this.props.showSubjectForm}>Add subject</NavLink>
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
                  <TableColumn>ID</TableColumn>
                  <TableColumn>Phone Number</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                { subjects.map(s => <SubjectItem key={s.id} subject={s} onClick={this.props.onSubjectClick} />) }
              </TableBody>
            </DataTable>
          </Card>
        </div>
      </div>
    )
  }
}

class SubjectItem extends Component {
  props: {
    subject: Subject,
    onClick: (subject: Subject) => void,
  }

  render() {
    const subject = this.props.subject
    return (
      <TableRow onClick={() => this.props.onClick(subject)}>
        <TableColumn>{subject.registrationIdentifier}</TableColumn>
        <TableColumn>{subject.phoneNumber}</TableColumn>
      </TableRow>
    )
  }
}

class Subjects extends Component {
  props: {
    campaignId: number,
    subjects: {
      count: number,
      items: Subject[],
      editingSubject: ?SubjectParams
    },
    collectionActions: {
      fetchSubjects: (campaignId: number) => void
    },
    itemActions: {
      createSubject: (campaignId: number, subject: SubjectParams) => void,
      editingSubjectCancel: () => void,
      subjectEditing: (fieldName: string, value: string) => void,
      editSubject: (subject: SubjectParams) => void,
    },
    navigate: (url: string) => void,
  }

  closeSubjectFormModal() {
    this.props.itemActions.editingSubjectCancel()
  }

  showSubjectForm() {
    this.props.itemActions.editSubject({phoneNumber: '', registrationIdentifier: ''})
  }

  onEditPhoneNumber = (value) => this.onEditField('phoneNumber', value)
  onEditRegistrationIdentifier = (value) => this.onEditField('registrationIdentifier', value)

  onEditField(fieldName, value) {
    this.props.itemActions.subjectEditing(fieldName, value)
  }

  componentWillMount() {
    this.props.collectionActions.fetchSubjects(this.props.campaignId)
  }

  createSubject() {
    if (this.props.subjects.editingSubject != null) {
      this.props.itemActions.createSubject(this.props.campaignId, this.props.subjects.editingSubject)
    } else {
      throw new Error("You can't create without editing a Subject")
    }
  }

  goToSubject(subject: Subject) {
    const campaignId = this.props.campaignId
    this.props.navigate(`/campaigns/${campaignId}/subjects/${subject.id}`)
  }

  pageTitle() {
    return 'Subjects!'
  }

  render() {
    const showDialog = this.props.subjects.editingSubject != null
    let subjectForm = null
    if (this.props.subjects.editingSubject != null) {
      subjectForm = <SubjectForm
        onSubmit={() => this.createSubject()}
        onCancel={this.closeSubjectFormModal}
        subject={this.props.subjects.editingSubject}
        onEditPhoneNumber={this.onEditPhoneNumber}
        onEditRegistrationIdentifier={this.onEditRegistrationIdentifier} />
    }

    return (
      <div className='md-grid--no-spacing'>
        <SubNav addButtonHandler={() => this.showSubjectForm()}>
          Subjects
        </SubNav>
        <SubjectsList
          items={this.props.subjects.items}
          count={this.props.subjects.count}
          showSubjectForm={this.showSubjectForm}
          onSubjectClick={(subject) => this.goToSubject(subject)} />
        <Dialog id='subject-form' visible={showDialog} onHide={() => this.closeSubjectFormModal()} title='Manage Subject'>
          {subjectForm}
        </Dialog>
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
