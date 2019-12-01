import {request} from './request'

export function getRightsList(type){
    return request({
        // list/tree格式，现在用list格式，所以传list
        url:`rights/${type}`
    })
}