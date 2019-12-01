import {request} from './request'

export function getRolesList(){
    return request({
        url:'roles'
    })
}

// 通过id删除角色的权限
export function removeRightById(roleId,rightId){
    return request({
        url:`roles/${roleId}/rights/${rightId}`,
        method:'delete'
    })
}

// 为角色分配权限
export function setRoleRights(roleId,idStr){
    return request({
        url:`roles/${roleId}/rights`,
        method:'post',
        data:{
            rids:idStr
        }
    })
}