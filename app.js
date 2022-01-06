
import { ConfidentialClientApplication } from '@azure/msal-node'; 

import fs from 'fs'
import crypto from 'crypto';

// ##CERTIFICATE KEYS
const certThumbprint = "734F07557964BEAA1F4786513E817BB3E92BEFBB";
const privateKeySource = fs.readFileSync('./certs/certTopk8.key');

//const privateKey = Buffer.from(privateKeySource, 'base64').toString().replace(/\r/g, "").replace(/\n/g, ""); 

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

const cca = new ConfidentialClientApplication(config);

const tokenRequest = {

    scopes: ["https://sandbox.esd.channelinclusion.microsoft.com/.default" ], 
  
}

//Get token by acquireTokenByClientCredential()

try {
const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);
    console.dir(authResponse); // access token
}  catch (error) {
    console.dir(JSON.stringify(error));
} 




/*
const tokenResponse = response.accessToken;


let query = await fetch('https://sandamericas.channelinclusiontest.microsoft.com/channelinclusionREST.svc/v3_1/' , {    
            headers: {
                    'Authorization': `Bearer ${tokenResponse}`,
                },
})  

// console.dir(json);
let json = await query.json();

// console.log(json); 

*/