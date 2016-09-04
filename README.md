# ClinicRun Server

This is a nodejs backend with a MongoDB for ClinicRun.

#Installation

1. Clone repo
2. Install MongoDB
3. `npm install`
4. Create a config.js file
5. Export an object with fields jwtsecret, db_local_url, port
6. Run node server

example :
        module.exports = {
                jwtsecret : '123456879798bfbg',
                db_local_url: 'mongodb://127.0.0.1:27017/your-db-name',
                port: 7000
            }
