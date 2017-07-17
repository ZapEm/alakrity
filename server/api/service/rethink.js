import config from 'config'
import rethinkdbdash from 'rethinkdbdash'


const rdb = rethinkdbdash(config.get('rethinkdbdash'))


export function find(tableName, id) {
    return rdb.table(tableName).get(id).run()
              .then(response => {
                  return response
              })
}

export function findAll(tableName) {
    return rdb.table(tableName).run()
              .then(response => {
                  return response
              })
}

export function findBy(tableName, fieldName, value) {
    return rdb.table(tableName).filter(rdb.row(fieldName).eq(value)).run()
              .then(response => {
                  return response
              })
}

export function findIndexed(tableName, query, index) {
    return rdb.table(tableName).getAll(query, { index: index }).run()
              .then(response => {
                  return response
              })
}

export function findIndexedWithFields(tableName, query, index, fields) {
    return rdb.table(tableName).getAll(query, { index: index }).withFields(fields).run()
              .then(response => {
                  return response
              })
}

export function findLastIndexed(tableName, query, index) {
    return rdb.table(tableName).getAll(query, { index: index }).nth(-1).default(null).run()
              .then(response => {
                  return response
              })
}

export function save(tableName, object) {
    return rdb
        .table(tableName)
        .insert(object).run()
        .then(response => {
            return (response.generated_keys)
                ? Object.assign({}, object, { id: response.generated_keys[0] })
                : object
        })
}

export function edit(tableName, id, object) {
    return rdb.table(tableName).get(id).update(object).run()
              .then(response => {
                  return response
              })
}

export function remove(tableName, id) {
    return rdb.table(tableName).get(id).delete().run()
              .then(response => {
                  return response
              })
}

export function createUser(username, hash, permissions = 'user') {
    return rdb
        .table('users')
        .insert({ id: username, password: hash, permissions: permissions }).run()
        .then(response => {
            return response
        })
}