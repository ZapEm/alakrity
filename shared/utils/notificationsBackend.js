import config from 'config'

import webpush from 'web-push'

const notyConfig = config.get('notification')

const vapidKeys = webpush.generateVAPIDKeys()

webpush.setGCMAPIKey(notyConfig.get('serverKey'))

webpush.setVapidDetails(
    'mailto:admin@zapem.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

// This is the same output of calling JSON.stringify on a PushSubscription
// const pushSubscription = {
//     endpoint: '.....',
//     keys: {
//         auth: '.....',
//         p256dh: '.....'
//     }
// }

export default function sendNotification(pushSubscription, payload) {
    webpush.sendNotification(pushSubscription, payload)
}

// webpush.sendNotification(pushSubscription, 'Your Push Payload Text')
//
//
// // image & actions are optional
// webpush.sendNotification(pushSubscription, JSON.stringify({
//     title: 'Noty title',
//     body: 'Noty body',
//     icon: 'https://your-icon0-url.png',
//     image: 'https://your-image-url.png',
//     url: 'http://ned.im/noty/?ref=webPushTest',
//     actions: [
//         {action: 'actionYes', 'title': 'Yes', 'icon': 'https://your-icon1-url.png'},
//         {action: 'actionNo', 'title': 'No', 'icon': 'https://your-icon2-url.png'}
//     ]
// }))