import axios from 'axios'

export function request(config){
    // 创建axios实例
    const instance=axios.create({
        baseURL:'https://renoblog.xyz/api/private/v1/',
        timeout:5000
    })

    instance.interceptors.request.use(config=>{
        return config
    })

    instance.interceptors.response.use(res=>{
        return res.data
    })
    return instance(config)
}