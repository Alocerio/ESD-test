
import { ConfidentialClientApplication } from '@azure/msal-node'; 
import fetch from 'node-fetch';
import fs from 'fs'
import crypto from 'crypto';

//https://sandamericas.channelinclusiontest.microsoft.com/channelinclusionREST.svc/v3_1/catalog?utcUpdatesFrom=10/28/2011+12:00:00&pg=1&lang=en-us

// ##CERTIFICATE KEYS
const certThumbprint = "734F07557964BEAA1F4786513E817BB3E92BEFBB";
const privateKeySource = fs.readFileSync('./certs/certTopk8.key');

const privateKeyObject = crypto.createPrivateKey({
    key: privateKeySource,
    passphrase: "newPW!",
    format: 'pem'
});

const privateKey = privateKeyObject.export({
    format: 'pem',
    type: 'pkcs8'
}); 

//MSAL.js configuration
const config = {
    auth: {
        clientId: "9B3468CE-AD3C-439F-8C46-CDD4C7E5AD9E",
        authority: "https://login.microsoftonline.com/msretailfederationppe.onmicrosoft.com/",
        clientCertificate: {
            thumbprint: certThumbprint, // a 40-digit hexadecimal string
            privateKey: privateKey,  //46f3e425-b99a-49b8-bbea-1ead1e7c47a7 
        },
        cache: {  
            cacheLocation: "sessionStorage"          
        }  
 
    }
};
//msal.js instance
const cca = new ConfidentialClientApplication(config);
//request token
const tokenRequest = {
    scopes: ["https://sandbox.esd.channelinclusion.microsoft.com/.default" ]
}
let url = "https://sandamericas.channelinclusiontest.microsoft.com/channelinclusionREST.svc/v3_1/catalog?utcUpdatesFrom=2018-01-01&lang=ww-WW&pg=1"

//Getting token
const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);    
console.log('Token response',authResponse);
//save token
const token = authResponse.accessToken;

//Header
const header = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    mode: 'cors',
    cache: 'default'
}

//Fetch function
async function Fecher(url, Header) {
	 await fetch(url, Header)
		.then(response => response.json())
        .then(datos => console.log(datos))
        .catch(error => console.log(error.message));
}

Fecher(url, header)
/*
const urlCatalogo ="catalog?utcUpdatesFrom=12%2f01%2f2021+12%3a00%3a00&pg=1&lang=ww-WW"
let catLoad = await fetch('https://sandamericas.channelinclusiontest.microsoft.com/channelinclusionREST.svc/v3_1/catalog?utcUpdatesFrom=12%2f01%2f2021+12%3a00%3a00&pg=1&lang=es-AR', {
method: 'GET',    
headers: {
        'Authorization': `Bearer ${token}`
        }
        });

 let json = await catLoad.json();
    console.log('Catalogo response',json);



*/