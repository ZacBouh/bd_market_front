import type { ScanResultHandlerProps } from "@/pages/ScanPage/ScanResultHandler";
import { api } from "./api";

const scanPicture = (payload : FormData, callback?: (data: ScanResultHandlerProps['data']) => unknown) => {
    const controller = new AbortController()
    api.post<ScanResultHandlerProps['data']>('/scan', payload, {signal: controller.signal})
    .then(response =>{
        callback && callback(response.data)
    })
}

export {scanPicture}