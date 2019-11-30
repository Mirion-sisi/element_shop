import {request} from './request'

// 获取左侧边栏的内容
export function getMenuList(){
    return request({
        url:'menus'
    })
}