import axios from 'axios';
import { FormData } from 'formdata-node';

const baseUrl = 'https://api.pinata.cloud';


/**
 * Pin File to IPFS
 * @param {string} pinataApiKey
 * @param {string} pinataSecretApiKey
 * @param {*} readStream
 * @param {*} options
 * @returns {Promise<unknown>}
 */
export function pinFileToIPFS(pinataApiKey, pinataSecretApiKey, readStream, options?): Promise<any> {

    return new Promise((resolve, reject) => {

        const data = new FormData();

        data.append('file', readStream);

        const endpoint = `${baseUrl}/pinning/pinFileToIPFS`;

        if (options) {
            if (options.pinataMetadata) {
                data.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
            }
            if (options.pinataOptions) {
                data.append('pinataOptions', JSON.stringify(options.pinataOptions));
            }
        }

        axios.post(
            endpoint,
            data,
            {
                withCredentials: true,
                headers: {
                    'Content-type': `multipart/form-data`,
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            }).then(function (result) {
            if (result.status !== 200) {
                reject(new Error(`unknown server response while pinning File to IPFS: ${result}`));
            }
            resolve(result.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}