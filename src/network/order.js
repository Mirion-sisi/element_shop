import {request} from './request'

export function getOrderList(queryInfo){
    return request({
        url:'orders',
        params:{
            // 查询的关键字，可以为空
            query:queryInfo.query,
            // 当前的页码,不能为空
            pagenum:queryInfo.pagenum,
            // 每页显示的条数，不能为空
            pagesize:queryInfo.pagesize,
            // 用户id,可以为空
            user_id:queryInfo.user_id,
            // 支付状态,可以为空
            pay_status:queryInfo.pay_status,
            // 是否发货,可以为空
            is_send:queryInfo.is_send,
            // ['个人','公司'],可以为空
            order_fapiao_title:queryInfo.order_fapiao_title,
            // 公司名称,可为空
            order_fapiao_company:queryInfo.order_fapiao_title,
            // 发票内容,可为空
            order_fapiao_content:queryInfo.order_fapiao_content,
            // 发货地址,可为空
            consignee_addr:queryInfo.consignee_addr,

        }
    })
}


// 查看物流信息
export function getKuaiDiInfo(id){
    return request({
        // id:物流运单号
        url:`kuaidi/${id}`,

    })
}