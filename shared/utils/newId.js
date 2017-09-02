let lastId = 0


/**
 * Creates IDs unique to the application, by counting upwards.
 * @param prefix: customize the prefix. ('TEMP_ID_' for temporary item IDs for optimistic updates)
 * @returns {string}
 */
export default function (prefix = 'ID_') {
    lastId++
    if ( !(typeof window !== 'undefined' && window.document) ) {
        prefix = 'server_' + prefix
    }
    return `${prefix}${lastId}`
}