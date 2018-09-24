module.exports = (instance, callback) => {

    instance.interceptors.request.use( config => {
        config.ts = Date.now()
        return config
    })

    instance.interceptors.response.use((response) => {
        callback(Number(Date.now() - response.config.ts))
        return response
    })
}