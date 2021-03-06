import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class EmptyListing extends Component {
  render() {
    return (
      <div className='md-text-center app-listing-no-data'>
        <div className='app-listing-no-data-image'>
          <img src={this.props.image} width='150px' />
        </div>
        <div className='app-listing-no-data-text'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

EmptyListing.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node
}
