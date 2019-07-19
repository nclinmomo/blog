module.exports = {
    host : process.env.SERVICE_OM_HOST,
    port : process.env.SERVICE_OM_PORT,
    path: "/api/om/v1/billings/transact",
    headers: {
        'Content-Type': 'application/json'
      }
}