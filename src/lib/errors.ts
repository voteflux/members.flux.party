const FluxErrHandler = {
    install: (Vue) => {
        Vue.prototype.showErr = (msg) => {
            // console.log("Showing error:", msg);
            this.$notify({
                title: "Error",
                text: msg,
                type: 'error'
            })
            return msg
        }
    }
}

export default FluxErrHandler;
