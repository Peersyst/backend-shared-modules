import axios from 'axios';
import { FormData } from 'formdata-node';
import stream from 'stream';

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

        if (!(readStream instanceof stream.Readable || readStream instanceof FormData)) {
            reject(new Error('readStream is not a readable stream or form data'));
        }

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
            readStream instanceof FormData ? readStream : data,
            {
                withCredentials: true,
                maxContentLength: 'Infinity' as any, //this is needed to prevent axios from erroring out with large files
                maxBodyLength: 'Infinity' as any,
                headers: {
                    'Content-type': `multipart/form-data; boundary= ${(data as any)._boundary}`,
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