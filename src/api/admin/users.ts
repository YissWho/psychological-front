import request from "../../utils/request"

export const getUsers = async (query: any) => {
  // 处理查询参数
  const queryParams = {
    pageNum: query.page?.currentPage,
    pageSize: query.page?.pageSize,
    username: query.form?.username,
    email: query.form?.email,
    role: query.form?.role
  }
  const res = await request.get("/admin/users", { 
    params: queryParams
  })
  return {
    records: res.data.records,
    total: res.data.total,
    size: res.data.size,
    current: res.data.current,
  }
}

/* 创建用户 */
export const createUser = (data: any) => {
  return request.post("/admin/users", data)
}

/* 更新用户 */
export const updateUser = (data: any) => {
  return request.put("/admin/users", data)
}

/* 删除用户 */
export const deleteUser = (id: string) => {
  return request.delete(`/admin/users/${id}`)
}

