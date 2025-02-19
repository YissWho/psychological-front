import request from "../../utils/request"

export const getHistory = async (params: any) => {
  const queryParams = {
    pageNum: params.page?.currentPage,
    pageSize: params.page?.pageSize,
    username: params.form?.username,
    assessmentTitle: params.form?.assessmentTitle,
  }
  const res = await request.get("/admin/user-assessments", { params: queryParams })
  return {
    records: res.data.records,
    total: res.data.total,
    size: res.data.size,
    current: res.data.current,
  }
}

