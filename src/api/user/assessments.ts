import request from '../../utils/request'

/* 获取所有问卷 */
export const getAssessments = () => request.get('/assessments')

/* 获取问卷详情 */
export const getAssessmentDetail = (id: string) => request.get(`/assessments/${id}`)

/* 提交问卷 */
export const submitAssessment = (data: any) => request.post('/assessments/submit', data)

/* 问卷统计 */
export const getAssessmentStatistics = (id: number) => request.get(`/assessments/${id}/statistics`)
