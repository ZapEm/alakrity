import { sendNotification } from '../modules/backend'
import PropTypes from 'prop-types'
import * as React from 'react'

@connect()
export default class testNotification extends React.Component {

    static propTypes = {
        notificationToken: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        dispatch: PropTypes.func
    }

    sendNotification() {
        const notification = {
            'title': 'Such Test',
            'body': 'Much WOW!',
            'icon': 'https://alakrity.treehaus.space/favicon.ico',
            'click_action': 'http://localhost:3000'
        }
        this.props.dispatch(sendNotification(notification))
    }


    render() {
        return <div className="test-notification">
            {prop}
        </div>
    }
}