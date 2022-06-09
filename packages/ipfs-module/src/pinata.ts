import axios from 'axios';
// import { FormData } from 'formdata-node';
var FormData = require('form-data');


/**
 * Pin File to IPFS
 * @param {string} pinataApiKey
 * @param {string} pinataSecretApiKey
 * @param {*} readStream
 * @param {*} options
 * @returns {Promise<unknown>}
 */
export async function pinFileToIPFS(pinataApiKey, pinataSecretApiKey, readStream, options?): Promise<any> {
    const data = new FormData();

    data.append('file', readStream);

    if (options) {
        if (options.pinataMetadata) {
            data.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
        }
        if (options.pinataOptions) {
            data.append('pinataOptions', JSON.stringify(options.pinataOptions));
        }
    }

    var config = {
        method: "post" as any,
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: { 
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey,
            ...data.getHeaders()
        },
        data : data
    };
    const res = await axios(config as any);
    return res.data;
}