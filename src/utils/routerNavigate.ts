type RouterNavigateFunction = ((to: string, option?: {replace?: boolean}) => void) 

class RouterNavigate {
    #navigateFunction : RouterNavigateFunction  | undefined 
    #intendedTo : string | undefined  

    setNavigate(navigate : RouterNavigateFunction) {
        this.#navigateFunction = navigate
    }
    setIntendedTo(path: string){
        this.#intendedTo = path
    }
    getIntendedTo(){
        return this.#intendedTo
    }
    navigate(to: string){
        if(!this.#navigateFunction){
            console.error(`RouterNavigate.navigateFunction is not set`)
            return
        }
        this.#navigateFunction(to)
    }
    postLoginRedirect(){
        if(this.#intendedTo === undefined){
            this.navigate('/collections')
            return
        }
        this.navigate(this.#intendedTo)
        this.#intendedTo = undefined
    }
}

export const routerNavigate = new RouterNavigate()