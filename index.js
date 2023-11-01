
require('dotenv').config()

var apiFyo = require("./src/ApiFyo")

let client = new apiFyo("dev");
client.login(process.env.B2C_USERNAME, process.env.B2C_PASSWORD, process.env.B2C_CLIENT_ID_TST).then(x => {
    console.log(x.access_token);
    console.log(client.expireDate.toLocaleString())
    console.time("timer1");
    client.post(liquidaciones.endpoint, liquidaciones.body).then(x => {
        console.log(x)
        console.timeEnd("timer1");
    }, e => console.log(e))
}, e => console.error(e))


let liquidaciones = {
    endpoint: 'granos/liquidaciones',
    body : {//numeroComprobante:220009255,
        //numeroContratoCorredor:190803,
        fechaDesde:"2023-07-01",
        fechaHasta:"2023-07-03"
    }
};

let contratos = {
    endpoint : "granos/contratos",
    body : {
        fechaContratoDesde : "2023-09-01",
        fechaContratoHasta : "2023-09-05"
        //numeroContratoCorredor : null}
    }
};
 
let aplicaciones = {
    endpoint : 'granos/aplicaciones',
    body : {
        fechaAplicacionDesde : "2023-08-01",
        fechaAplicacionHasta : "2023-08-05"
    }
};