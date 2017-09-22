import * as React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sendNotification } from '../utils/notificationsBackend'


@connect(state => ({
    subData: state.backend.get('subData')
}))
export default class Notifications extends React.Component {

    static propTypes = {
        prop: PropTypes.any
    }



    render() {
        const { prop } = this.props


        if(typeof window === 'undefined'){
            const sendNotification = require('../utils/notificationsBackend')





        }

        return <div className="notifications">
            {prop}
        </div>
    }
}