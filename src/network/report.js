import {request} from './request'


// 获取时间统计的折线图
export function getReportData(){
    return request({
        url:'reports/type/1'
    })
}