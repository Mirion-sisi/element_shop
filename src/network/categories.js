import {request} from './request'

// 获取分类列表
export function getCateList(queryInfo){
    return request({
        url:'categories',
        params:{
            // 以下都非必填参数
            type:queryInfo.type,      
            pagenum:queryInfo.pagenum,
            pagesize:queryInfo.pagesize
        }
    })
}

// 添加分类
export function addCategories(cateFrom){
    return request({
        url:'categories',
        method:'post', 
        data:{
            // 必填参数
            cat_pid:cateFrom.cat_pid,
            cat_name:cateFrom.cat_name,
            cat_level:cateFrom.cat_level

        }
    })
}