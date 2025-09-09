import { api } from "./api";

const scanPicture = (payload : FormData) => {
    const controller = new AbortController()
    api.post<ApiResponse>('/scan', payload, {signal: controller.signal})
    .then(response => console.log("Scan Picture response : " , response.data))
}

export {scanPicture}