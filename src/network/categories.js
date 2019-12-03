import {request} from './request'

// 获取商品分类列表
export function getCateList(queryInfo){
    return request({
        url:'categories',
        params:{
            // 以下都非必填参数
            // type可填1,2,3,分别表示显示一层二层分类列表,不填默认获取所有级别的列表
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