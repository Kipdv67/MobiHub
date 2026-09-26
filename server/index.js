import http from 'node:http'
import mysql from 'mysql2/promise'

const port = Number(process.env.PORT || 3001)
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'mobihub',
  user: process.env.DB_USER || 'mobihub',
  password: process.env.DB_PASSWORD || 'mobihub_dev_password',
  waitForConnections: true,
  connectionLimit: 10,
})

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(payload))
}

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname

  if (request.method === 'GET' && pathname === '/api/health') {
    try {
      const [rows] = await pool.query('SELECT DATABASE() AS databaseName')
      sendJson(response, 200, { status: 'ok', database: 'connected', name: rows[0].databaseName })
    } catch (error) {
      console.error('Database health check failed:', error.message)
      sendJson(response, 503, { status: 'error', database: 'disconnected' })
    }
    return
  }

  sendJson(response, 404, { error: 'Not found' })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`MobiHub API listening on port ${port}`)
})