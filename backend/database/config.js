const config= {
    dbName:process.env.PGDATABASE,
    userName:process.env.PGUSER,
    password:process.env.PGPASSWORD,
    host:process.env.PGHOST,
    dialect:process.env.DIALECT,
    port:process.env.PGPORT
}
module.exports={config}