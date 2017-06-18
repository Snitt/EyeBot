const MySql = require('mysql')
const config = require('../json/config.json')

var pool = MySql.createPool({
  host: config.mysql.host,
  database: config.mysql.database,
  user: config.mysql.user,
  password: config.mysql.password
})

function query (query, values = []) {
  return new Promise((resolve, reject) => {
    pool.getConnection((poolError, connection) => {
      if (poolError) reject(poolError)

      connection.query(query, values, (queryError, results, fields) => {
        connection.release()

        if (queryError) { console.log(`Query Failed ${query}`); reject(queryError) }
        resolve(results)
      })
    })
  })
}

module.exports = {
  query: query
}
