async function login(username, password, clientId){
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
    if (!response.ok) throw new Error(await response.json());
    return await response.json(); 
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function getExpireDate(seconds) {
    const date = new Date();
    return new Date(date.getTime() + seconds*1000);
}

async function post(token, reqBody){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: reqBody,
    redirect: 'follow'
    };

    var response = await fetch("https://apim-integraciones-tst-002.azure-api.net/canjes/comprobantes", requestOptions);
    if (!response.ok) throw new Error(await response.json());
    await response.json();

}
require('dotenv').config()


var raw = JSON.stringify({
    "numeroContrato": 1234,
    "numeroComprobante": 101231233,
    "fechaDesde": "2022-01-06",
    "fechaHasta": "2023-01-19",
    "page": 1,
    "pageSize": 50
    });
login(process.env.USERNAME, process.env.PASSWORD, process.env.CLIENT_ID).then(x => {
    console.log(x.access_token);
    console.log(getExpireDate(parseInt(x.expires_in)).toLocaleString())
}, e => console.error(e))