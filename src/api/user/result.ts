import request from "../../utils/request"

/* 获取基本结果 */
export const getResult = () => request.get(`/assessments/history`)

/* 获取详细结果 */
export const getResultDetail = () => request.get('/assessments/history/detailed')
