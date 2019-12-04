// 时间格式化工具
import { dateFormat } from './util'

export const formatDate = {
    filters: {
        dateFormat(date) {
            return dateFormat(date)
        }
    }
}