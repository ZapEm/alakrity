import Noty from 'noty'


export function initializeNotyPush() {

    if ( typeof window === 'undefined' ) {
        return
    }



    let subData = false

    const NotyPush = Noty.Push('../../service-worker.js')
                         .on('onPermissionGranted', function () {
                             console.log('Perm: granted')
                         })
                         .on('onPermissionDenied', function () {
                             console.log('Perm: denied')
                         })
                         .on('onSubscriptionSuccess', function (sub) {
                             subData = sub
                             console.log('Subscription:', sub)
                             // (YOU NEED TO STORE THIS VALUES FOR LATER USE)
                         })
                         .on('onSubscriptionCancel', function (sub) {
                             console.log('Subscription: canceled')
                         })
                         .on('onWorkerSuccess', function () {
                             console.log('Worker: installed')
                         })
                         .on('onWorkerError', function (err) {
                             console.log('Worker: failed', err)
                         })
                         .on('onWorkerNotSupported', function (err) {
                             console.log('Worker: not supported', err)
                         })

    return { NotyPush: NotyPush, subData: subData }
}

// function configureServiceWorker() {
//     // only works in CLIENT!
//     const registerServiceWorker = require('../../service-worker.js.bkp')
//
//     if ( 'serviceWorker' in navigator ) {
//         window.addEventListener('load', function () {
//             registerServiceWorker({ scope: '/' }).then(registration => {
//                 // Registration was successful
//                 console.log('ServiceWorker registration successful with scope: ', registration.scope)
//             }, err => {
//                 // registration failed :(
//                 console.log('ServiceWorker registration failed: ', err)
//             })
//         })
//     }
// }