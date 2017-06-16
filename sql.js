const MySql = require('mysql')
const config = require('./config.json')

var pool = MySql.createPool({
  host: config.mysql.host,
  database: config.mysql.database,
  user: config.mysql.user,
  password: config.mysql.password
})

function query (query) {
  return new Promise((resolve, reject) => {
    pool.getConnection((poolError, connection) => {
      if (poolError) reject(poolError)

      connection.query(query, (queryError, results, fields) => {
        connection.release()

        if (queryError) reject(queryError)
        resolve(results)
      })
    })
  })
}

module.exports = {
  query: query
}
