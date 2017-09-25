import config from 'config'
/* global Promise */
import rethinkdbdash from 'rethinkdbdash'

const dbConfig = config.get('rethinkdbdash')

const r = rethinkdbdash(dbConfig)

let DATABASE = dbConfig.servers[0].db || 'alakrity_db'

/*
 * Array of table definitions like
 * { name: 'timetables', secIndex: 'userID' | [...] }
 *
 * secIndex can be a single definition or an array of definitions.
 * Valid definitions are:
 *  'nameOfField'                                                                for a simple secondary index, or
 *  { type: 'compound', indexName: 'nameOfField', fields: ['field1', 'field2'] } for a compound index, or
 *  { type: 'multi', indexName: 'nameOfFieldWithArray' }                         for a multi index that works like tags.
 */
let TABLES = [
    { name: 'users' },
    { name: 'tasks', secIndex: 'userID' },
    { name: 'timetables', secIndex: 'userID' },
    { name: 'projects', secIndex: 'userID' },
    {
        name: 'statistics',
        secIndex: [
            'userID',
            'weekDate',
            //{ type: 'compound', indexName: 'userWeekDate', fields: ['userID', 'weekDate'] }
        ]
    }
]

dbSetup()

function dbSetup() {
    console.log(' [>] Database Setup')
    createDbIfNotExists()
        .then(() => Promise.all(
            TABLES.map(
                (table) => createTableIfNotExists(table.name)
                    .then((res) => (table.secIndex)
                        ? createSecondaryIndex(table.name, table.secIndex)
                        : res)
            )
        ))
        .then(() => {
            console.log(' [<] Setup Done!')
            return r.getPoolMaster().drain()
        })

}

function createDbIfNotExists() {
    return getDbList()
        .then((list) => {
            if ( list.indexOf(DATABASE) === -1 ) {
                return createDatabase()
            } else {
                console.log(' [!] Database already exists:', DATABASE)
                return Promise.resolve(true)
            }
        })
}

function createTableIfNotExists(table) {
    return getTableList()
        .then((list) => {
            if ( list.indexOf(table) === -1 ) {
                return createTable(table)
            } else {
                console.log(' [!] Table already exists:', table)
                return Promise.resolve(true)
            }
        })
}

function getDbList() {
    return r.dbList().run()
}

function getTableList() {
    return r.db(DATABASE).tableList().run()
}

function createDatabase() {
    console.log(' [+] Creating Database:', DATABASE)
    return r.dbCreate(DATABASE).run()
}

function createTable(table) {
    console.log(' [+] Creating Table:', table)
    return r.db(DATABASE).tableCreate(table).run()
}


function createSecondaryIndex(table, secIndex) {
    if ( Array.isArray(secIndex) ) {
        return Promise.all(
            secIndex.map(
                (secIndex) => createSecondaryIndex(table, secIndex)
            )
        )
    }

    let rQuery
    if ( secIndex && secIndex.constructor === Object ) {
        if ( secIndex.type === 'compound' ) {
            rQuery = r.db(DATABASE).table(table).indexList().contains(secIndex.indexName).do(containsIndex => {
                return r.branch(
                    containsIndex,
                    { created: 0 },
                    r.db(DATABASE).table(table).indexCreate(secIndex.indexName, (row) => secIndex.fields.map(field => row(field)))
                )
            })
        } else if ( secIndex.type === 'multi' ) {
            rQuery = r.db(DATABASE).table(table).indexList().contains(secIndex.indexName).do(containsIndex => {
                return r.branch(
                    containsIndex,
                    { created: 0 },
                    r.db(DATABASE).table(table).indexCreate(secIndex.indexName, { multi: true })
                )
            })
        }
    } else {
        rQuery = r.db(DATABASE).table(table).indexList().contains(secIndex).do(containsIndex => {
            return r.branch(
                containsIndex,
                { created: 0 },
                r.db(DATABASE).table(table).indexCreate(secIndex)
            )
        })
    }

    return rQuery.run()
                 .then((res) => {
                     if ( res.created === 1 ) {
                         console.log(' [+] Index (', secIndex, ') Created for Table:', table)
                     } else {
                         console.log(' [!] Index (', secIndex, ') already exists for Table:', table)
                     }
                     return res
                 })
}