import * as React from 'react'
import LabeledIconButton from './LabeledIconButton'
import notifyUser from '../../utils/notifications'
import Loading from './Loading'

export default class NotificationPermissionRequester extends React.Component {

    constructor() {
        super()
        this.state = {
            permission: (typeof window !== 'undefined') ? ('Notification' in window) ? Notification.permission : 'not-supported' : 'server'
        }
    }

    handleRequestPermission() {
        Notification.requestPermission().then((result) => {
            this.setState({ permission: result })
            notifyUser('Permission granted!', {
                    icon: require('img/goodwork_cropped.png'),
                    body: 'Alakrity can now show notifications like this as long as the tab is open somewhere in the background.',
                    tag: 'permission_granted'
                }
            )
        })
    }

    render() {
        const { permission } = this.state

        if ( permission === 'server' ) {
            return <div className="notification-permission-requester-wrapper">
                <Loading/>
            </div>
        }

        let status
        if ( permission === 'not-supported' ) {
            status = {
                element: <i className="material-icons w3-text-red w3-xxlarge w3-display-middle">block</i>,
                message: 'Notifications are not supported by your browser! Please try a recent Chrome or FireFox.'
            }
        } else if ( permission === 'granted' ) {
            status = {
                element: <i className="material-icons w3-text-green w3-xxlarge w3-display-middle">check</i>,
                message: 'Permission granted!'
            }
        } else if ( permission === 'denied' ) {
            status = {
                element: <i className="material-icons w3-text-red w3-xxlarge w3-display-middle">block</i>,
                message: 'Permission denied! Please check your website permissions.'
            }
        } else {
            status = {
                element: <i className="material-icons w3-text-orange w3-xxlarge w3-display-middle">warning</i>,
                message: <LabeledIconButton label={'Request Permission'} iconName={'vpn_key'}
                                            onClick={::this.handleRequestPermission}/>
            }
        }

        return <div className="notification-permission-requester-wrapper">
            <h5 className="w3-text-theme w3-center">Please allow notifications so Alakrity can send reminders.</h5>
            <div
                className="w3-display-container notification-permission-requester w3-card w3-round w3-border w3-border-theme">
                <div className="notification-permission-requester-icon w3-display-container">
                    {status.element}
                </div>
                <div className="notification-permission-requester-message w3-display-right">
                    {status.message}
                </div>
            </div>
        </div>
    }
}