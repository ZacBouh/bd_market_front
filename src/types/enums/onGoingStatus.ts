export const supportedOnGoingStatus = [
    'ongoing',
    'canceled',
    'completed',
    'paused'
] as const

export type SupportedOnGoingStatus = typeof supportedOnGoingStatus[number]

export const  onGoingStatusLabel : Record<SupportedOnGoingStatus, string> = {
    'ongoing' : 'On Going',
    'canceled' : 'Canceled',
    'completed' : 'Completed',
    'paused' : 'Paused'
}