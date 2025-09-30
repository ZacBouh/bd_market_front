export default function debounce<T extends (...args: any[]) => any>(callback : T, wait = 300){
    let timerId : NodeJS.Timeout | undefined = undefined
     return function(this: any, ...args : Parameters<T>){
        const context : any = this
        clearTimeout(timerId)
        timerId = setTimeout(() => callback.call(context, ...args), wait)
    }
}