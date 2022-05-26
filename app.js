import { ConfidentialClientApplication } from "@azure/msal-node";
import fetch from "node-fetch";
import fs from "fs";
import crypto from "crypto";
import axios from "axios";

//https://sandamericas.channelinclusiontest.microsoft.com/channelinclusionREST.svc/v3_1/catalog?utcUpdatesFrom=10/28/2011+12:00:00&pg=1&lang=en-us

// ##CERTIFICATE KEYS [SENSIVE INFORMATION]##
const certThumbprint = "734F07557964BEAA1F4786513E817BB3E92BEFBB";
const privateKeySource = fs.readFileSync("./certs/certTopk8.key");

const privateKeyObject = crypto.createPrivateKey({
  key: privateKeySource,
  passphrase: "newPW!",
  format: "pem",
});

const privateKey = privateKeyObject.export({
  format: "pem",
  type: "pkcs8",
});

//MSAL.js configuration [SENSIVE INFORMATION]##
const config = {
  auth: {
    clientId: "9B3468CE-AD3C-439F-8C46-CDD4C7E5AD9E",
    authority:
      "https://login.microsoftonline.com/msretailfederationppe.onmicrosoft.com",
    clientCertificate: {
      thumbprint: certThumbprint, // a 40-digit hexadecimal string
      privateKey: privateKey, //46f3e425-b99a-49b8-bbea-1ead1e7c47a7
    },
    cache: {
      cacheLocation: "sessionStorage",
    },
  },
};

//Create msal application object []
const cca = new ConfidentialClientApplication(config);

//request token [check]
const clientCredentialRequest = {
  refreshToken: "",
  scopes: ["https://sandbox.esd.channelinclusion.microsoft.com//default"],
};

//Getting token
const authResponse = await cca.acquireTokenByClientCredential(clientCredentialRequest);
console.log("Token response", authResponse);

//save token
const token = authResponse.accessToken;
//console.log("Token string:", token);

//url to get the catalog 
let url =
  "https://sandamericas.channelinclusiontest.microsoft.com/channelinclusionREST.svc/v3_1/catalog?utcUpdatesFrom=05/12/2022&pg=1&lang=ww-WW";

//Header
const header = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
    },
};
/*
// Make request 
axios.get(url, header)
  .then(function (response) {
    // handle success
    console.log( response.json());
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
 
/*
//Fetch simple function
 
	 fetch(url, header)
        .then(response => response.json())
        .then(datos => console.log(datos))
        .catch(error => console.log(error));


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
