import type { ScanPageState } from '@/pages/ScanPage/ScanPage'
import {createStore, set, get, update, keys, del} from 'idb-keyval'

const scanStore = createStore('scanDB', 'scanStore')

const setScan = async (key: string, value: any) => {
    await set(key, value, scanStore)
}

const getScan = async (key: string, initialValue: ScanPageState) => {
    const scanFile = await get<ScanPageState>(key, scanStore)
    return scanFile ?? initialValue
}

const deleteScan = async (key: string) => {
    await del(key, scanStore)
}

const updateScan = async <T extends ScanPageState,>(key: string, updater : (oldScanPageState?: T ) => T) => {
    await update(key, updater, scanStore)
}

const scanKeys = async () => {
    return  await keys<string>(scanStore)
}

export default [getScan, setScan, deleteScan, scanKeys] as const

export const idbStorage = {
    getItem : getScan,
    setItem: setScan,
    removeItem: deleteScan
} as const
