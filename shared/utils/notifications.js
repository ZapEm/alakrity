import * as _ from 'lodash/object'


let notifyUser = () => {
} // shim
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

        console.log(title, options)

        Notification.requestPermission(() => {
            const notification = new Notification(title, options)


            notification.addEventListener('click', (event) => {
                if ( parent ) {
                    parent.focus()
                }
                window.focus()
                notification.close()
            })
            // notificationEvents.forEach((eventName) => {
            //     notification[eventName] = (event) => {
            //         console.log('Event' + event.type + ' triggered for notification ' + notification.tag)
            //     }
            // })
        })
    }
}

export default notifyUser