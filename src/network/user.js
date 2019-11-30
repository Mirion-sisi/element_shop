import { request } from './request'

export function getUserList(queryInfo) {
    return request({
        url: 'users',
        params: {
            query: queryInfo.query,
            pagenum: queryInfo.pagenum,
            pagesize: queryInfo.pagesize
        }

    })
}
export function userStateChanged(userInfo) {
    return request({
        method: 'put',
        url: `users/${userInfo.id}/state/${userInfo.mg_state}`,

    })
}

export function addUser(addForm) {
    console.log(addForm)
    return request({
        url: 'users',
        method: 'post',
        data: {
            username: addForm.username,
            password: addForm.password,
            email: addForm.email,
            mobile: addForm.mobile
        },
    })
}

export function getEditUser(id) {
    return request({
        url: `users/${id}`
    })
}

export function editUser(editForm) {
    return request({
        url: `/users/${editForm.id}`,
        method: 'put',
        data: {
            email: editForm.email,
            mobile: editForm.mobile
        }
    })
}

export function deleUserById(id){
    return request({
        url:`/users/${id}`,
        method:'delete'
    })
}