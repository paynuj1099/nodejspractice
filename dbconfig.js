const config = {
    user: 'test',
    password: 'test',
    server: '172.26.220.202', // standard to use hostname instead of IP Add 10.27.35.234
    database: 'PracticeAPI',
    options:{
        trustServerCertificate: true,
        encrypt: false, // Disable encryption to avoid self-signed certificate errors
        enableArithAbort: true, // Ignore self-signed certificate warnings
    },
    port : 1433 // This is SQL PORT //SELECT local_tcp_port FROM sys.dm_exec_connections WHERE session_id = @@SPID //EXECUTE THIS QUERY IN SQL TO GET THE PORT
}

module.exports = config;