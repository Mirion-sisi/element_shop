import { request } from './request'

export function getParamsList(id, sel) {
    return request({
        url: `categories/${id}/attributes`,
        params: {
            // 不能为空,通过only/many来获取分类是静态参数还是动态参数
            sel: sel
        }
    })
}

// 添加属性参数的接口
export function addParams(id, name, sel, vals) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'post',
        data: {
            // 参数名称,不能为空
            attr_name: name,
            // 参数是only/many,不能为空
            attr_sel: sel,
            // 如果是many需填写值的选项,以逗号分隔;可选参数
            //此处可以不提供
            attr_vals: vals
        }
    })
}


// 根据Id查询参数
export function getParamsById(cateId, attrId, sel, vals) {
    return request({
        url: `categories/${cateId}/attributes/${attrId}`,
        params: {
            // 不能为空,填only/many
            attr_sel: sel,
            // 非必需值,若是many,就需填写值的选项,以逗号分隔
            attr_vals: vals
        }
    })
}

// 提交修改的参数
export function putEditParams(catId,attrId,attr_name,attr_sel,attr_vals){
    return request({
        url:`categories/${catId}/attributes/${attrId}`,
        method:'put',
        data:{
            // 不能为空
            attr_name:attr_name,
            // 不能为空
            attr_sel:attr_sel,
            // 可选参数
            attr_vals:attr_vals
        }
    })
}
// 删除参数
export function deleteParams(cat_id,attr_id){
    return request({
        url:`categories/${cat_id}/attributes/${attr_id}`,
        method:'delete'

    })
}