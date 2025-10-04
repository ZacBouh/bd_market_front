import type { ShowNotification, CloseNotification } from "@toolpad/core/useNotifications";

type UseNotifications = {
    show: ShowNotification,
    close: CloseNotification
}

class PadNotification{
    #notificationFunc : UseNotifications | undefined

    setNotificationFunc(notificationFunc: UseNotifications){
        this.#notificationFunc = notificationFunc
    }

    show(...args : Parameters<UseNotifications['show']>){
        if(this.#notificationFunc){
            return this.#notificationFunc.show(...args)
        }
        console.error("Notification function is not defined")
    }

    close(...args : Parameters<UseNotifications['close']>){
        if(this.#notificationFunc){
            return this.#notificationFunc?.close(...args)
        }
        console.error("Notification function is not defined")
    }
}

export const notification = new PadNotification()