import axios from 'axios'

export function request(config) {
    // 创建axios实例
    const instance = axios.create({
        baseURL: 'https://renoblog.xyz/api/private/v1/',
        timeout: 5000
    })

    instance.interceptors.request.use(config => {
        // 为请求头对象，添加token验证的Authorization字段
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })

    instance.interceptors.response.use(res => {
        return res.data
    })
    return instance(config)
}