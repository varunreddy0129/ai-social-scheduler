import {Zernio} from '@zernio/node';

const zernio = new Zernio({
    apiKey : process.env.ZERNIO_API_KEY || '',
    baseURL : process.env.ZERNIO_BASE_URL || 'https://api.zernio.com',
});

export default zernio;