import * as _ from 'lodash/object'

// shim
let notifyUser = () => {
}

if ( typeof window === 'undefined' || !('Notification' in window) ) {
    // server or not supported
    if ( typeof window !== 'undefined' ) {
        console.log('Notifications are not supported on this browser.')
    }
} else {
    //const notificationEvents = ['onclick', 'onshow', 'onerror', 'onclose']

    notifyUser = (title, options) => {

        title = title ? title : 'no title'
        options = _.merge({},
            {
                icon: require('img/idea_cropped.png'),
                body: '',
                tag: 'default'
            },
            options)

        Notification.requestPermission(() => {
            const notification = new Notification(title, options)


            notification.addEventListener('click', () => {
                if ( parent ) {
                    parent.focus()
                }
                window.focus()
                notification.close()
            })
        })
    }
}

export default notifyUser