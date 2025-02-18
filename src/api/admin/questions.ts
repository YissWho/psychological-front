import request from "../../utils/request"

export const getQuestionnaires = async (query: any) => {
  const res = await request.get("/admin/assessments", {
    params: query,
  })
  return res.data
}

/* 创建用户 */
export const createQuestionnaire = (data: any) => {
  return request.post("/admin/assessments", data)
}

/* 更新用户 */
export const updateQuestionnaire = (data: any) => {
  return request.put("/admin/assessments", data)
}

/* 删除用户 */
export const deleteQuestionnaire = (id: string) => {
  return request.delete(`/admin/assessments/${id}`)
}

/* 查看该问卷的评分规则 */
export const getQuestionnaireScoreRules = (assessmentId: string) => {
  return request.get(`/admin/result-explanations/assessment/${assessmentId}`)
}

/* 创建评分规则
    "assessmentId": 3,
    "minScore": 11,
    "maxScore": 15,
    "category": "较差",
    "description": "较差",
    "recommendation": "较差"
*/
export const createQuestionnaireScoreRules = (data: any) => {
  return request.post("/admin/result-explanations", data)
}

/* 更新评分规则 */
/*  
"assessmentId": 3,
    "minScore": 5,
    "maxScore": 10,
    "category": "一般",
    "originalCategory": "一般",
    "description": "心理状态一般22",
    "recommendation": "需要调整自身的心态" 
*/
export const updateQuestionnaireScoreRules = (data: any) => {
  return request.put("/admin/result-explanations", data)
}

/* 删除评分规则 */
export const deleteQuestionnaireScoreRules = (
  assessmentId: string,
  category: string
) => {
  return request.delete("/admin/result-explanations", {
    params: {
      assessmentId,
      category,
    },
  })
}
