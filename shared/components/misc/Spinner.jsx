import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

export default class Spinner extends React.Component {

    static propTypes = {
        status: PropTypes.oneOf(['IDLE', 'WORKING', 'ERROR', 'WARNING'])
    }

    static defaultProptypes = {
        status: 'IDLE'
    }


    render() {
        const { status } = this.props
        const classes = classNames('alakrity-spinner', {
                'alakrity-spinner-animate': status === 'WORKING',
                'alakrity-spinner-warning': status === 'WARNING',
                'alakrity-spinner-error': status === 'ERROR'
            }
        )
        return (
            <div className={classes}/>
        )
    }
}