import request from "../../utils/request"

export interface RecordsParams {
  gender?:          string;
  pageNum?:         string;
  pageSize?:        string;
  sleepQuality?:    string;
  stressLevel?:     string;
  username?:        string;
  [property: string]: any;
}
export const getRecords = async (params: RecordsParams) => {
  const queryParams = {
    pageNum: params.page?.currentPage,
    pageSize: params.page?.pageSize,
    gender: params.form?.gender,
    sleepQuality: params.form?.sleepQuality,
    stressLevel: params.form?.stressLevel,
    username: params.form?.username,
  }
  const res = await request.get("/admin/psychological-records", { params: queryParams })
  return {
    records: res.data.records,
    total: res.data.total,
    size: res.data.size,
    current: res.data.current,
  }
}

