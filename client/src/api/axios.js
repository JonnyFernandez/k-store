import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3001/api',
    // baseURL: 'https://port-control-api-production.up.railway.app/api',
})

export default instance