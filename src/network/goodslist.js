import { request } from './request'

// 获取商品列表
export function getGoodsList(queryInfo) {
    return request({
        url: 'goods',
        params: {
            // 可不填
            query: queryInfo.query,
            // 不能为空
            pagenum: queryInfo.pagenum,
            // 不能为空
            pagesize: queryInfo.pagesize
        }
    })
}

// 删除商品 根据id
export function deleteById(id) {
    return request({
        url: `goods/${id}`,
        method: 'delete'
    })
}

// 添加商品
export function addGoods(goods) {
    return request({
        url: 'goods',
        method:'post',
        data: {
            goods_name: goods.goods_name,
            goods_price: goods.goods_price,
            goods_number: goods.goods_number,
            goods_weight: goods.goods_weight,
            // 商品所属分类数组
            goods_cat: goods.goods_cat,
            // 商品的详情描述,可为空
            goods_introduce: goods.goods_introduce,
            // 图片列表,可为空
            pics: goods.pics,
            // 商品参数/属性数组{ attr_id: '',attr_value:''},可为空
            attrs: goods. attrs
        }
    })
}