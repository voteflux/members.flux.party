
interface SError<T> { msg: string; sample: T | null, wipe: () => void }


export const emptyErr = <T>(): SError<T> => new Proxy({msg: '', sample: null, wipe: () => {}}, {
    get: (obj, prop) => {
        if (prop == "wipe")
            return () => { obj.msg = ''; obj.sample = null; }
        return obj[prop];
    }
})


export const mkErrFrom = <T>(msg, sample: T): SError<T> => {
    const e: SError<T> = emptyErr()
    e.msg = msg;
    e.sample = sample;
    return e;
}


export const mkErrContainer = () => {
    let newObj = {}
    return new Proxy(newObj, {
        get: (obj, prop) => {
            return prop in obj ? obj[prop] : emptyErr()
        },
        set: (obj, prop, value) => {
            obj[prop] = value
            return true
        }
    })
}


const FluxErrHandler = {
    install: (Vue) => {
        Vue.prototype.$err = <T>(msg, orig: T): SError<T> => {
            Vue.prototype.$notify({
                title: "Error",
                text: msg,
                type: 'error'
            })
            return mkErrFrom(msg, orig)
        }
    }
}


export default FluxErrHandler;
