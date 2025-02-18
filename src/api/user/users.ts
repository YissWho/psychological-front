import request from '../../utils/request'

/* 获取用户信息 */
export const getUserInfo = () => request.get('/users/current')

/* 更新用户信息 */
export const updateUserInfo = (data: any) => request.put('/users/current', data)

/* 获取用户心理档案 */
export const getUserPsychologicalFile = () => request.get('/psychological-records/current')

/* 更新用户心理档案 */
export const updateUserPsychologicalFile = (data: any) => request.put('/psychological-records/current', data)

