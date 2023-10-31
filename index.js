class apiFyo{
    constructor(env = "dev"){
        this.env = env; //tst | stg | prd
        this.expireDate;
        this.token = '';
        this.baseUrl = `https://apim-integraciones-${env}-002.azure-api.net`;
    }
    async login(username, password, clientId){
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        let urlencoded = new URLSearchParams();
        urlencoded.append("client_id", clientId);
        urlencoded.append("username", username);
        urlencoded.append("password", password);
        urlencoded.append("scope", `openid ${clientId}`);
        urlencoded.append("grant_type", "password");
        urlencoded.append("response_type", "token id_token");
    
        let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
        };
    
        let response = await fetch("https://apim-integraciones-dev-002.azure-api.net/token", requestOptions)
        if (!response.ok) throw new Error(await response.text());
        let data = await response.json()
        this.token = data.access_token;
        this.expireDate = this.getExpireDate(parseInt(data.expires_in));
        return data; 
    }
    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
    getExpireDate(seconds) {
        const date = new Date();
        return new Date(date.getTime() + seconds*1000);
    }
    
    async post(endpoint, reqBody){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.token);
        myHeaders.append("Content-Type", "application/json");
    
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: reqBody,
        redirect: 'follow'
        };
    
        var response = await fetch(`${this.baseUrl}/${endpoint}`, requestOptions);
        if (!response.ok) throw new Error(await response.text());
        await response.json();
    
    }
}
require('dotenv').config()

let client = new apiFyo();
client.login(process.env.B2C_USERNAME, process.env.B2C_PASSWORD, process.env.B2C_CLIENT_ID).then(x => {
    console.log(x.access_token);
    console.log(client.expireDate.toLocaleString())
    client.post('canjes/comprobantes', raw).then(x => console.log(x), e => console.log(e))
}, e => console.error(e))

var raw = JSON.stringify({
    "numeroContrato": 1234,
    "numeroComprobante": 101231233,
    "fechaDesde": "2022-01-06",
    "fechaHasta": "2023-01-19",
    "page": 1,
    "pageSize": 50
    });