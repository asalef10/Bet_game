const mysql = require('mysql')
let HOST = process.env.DB_HOST
let USER = process.env.DB_USER
let PASSWORD = process.env.DB_PASSWORD
let DATABASE = process.env.DB_NAME

const pool = mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
})

module.exports = {
  getConnection: async function _getConnection() {
    return new Promise((res, rej) => {
      pool.getConnection(function (err, connection) {
        if (!err) res(connection)
        else rej(err)
      })
    })
  },

  QueryDB: async function _queryDB(sql) {
    const con = await this.getConnection()

    return new Promise((resolve, rej) => {
      con.query(sql, function (err, result) {
        con.release()
        if (err) {
          console.log(err)
          rej(err)
        }
        resolve(result)
      })
    })
  },
}
