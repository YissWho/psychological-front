<template>
  <div class="assessment-container">
    <div class="header">
      <h2>心理评估</h2>
      <p class="description">请选择以下任一问卷开始评估</p>
    </div>
    <a-list
      :grid="{ gutter: 16, column: 4 }"
      :data-source="assessmentList"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card
            hoverable
            class="assessment-card"
            @click="handleAssessmentClick(item.id)"
          >
            <template #cover>
              <div class="card-icon">
                <FormOutlined />
              </div>
            </template>
            <a-card-meta :title="item.title">
              <template #description>
                <div class="card-description">{{ item.description }}</div>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts" name="Assessment">
import { ref, onMounted } from "vue"
import { FormOutlined } from "@ant-design/icons-vue"
import { getAssessments } from "../../../api/user/assessments"
import { useRequest } from "vue-request"
import "./index.less"
import router from "../../../router"

const assessmentList = ref<any[]>([])

const { loading, run: fetchAssessments } = useRequest(getAssessments, {
  onSuccess: (result: any) => {
    assessmentList.value = result.data
  },
})

const handleAssessmentClick = (id: number) => {
  console.log("选择的问卷ID：", id)
  router.push({
    path: "/users/assessment/create",
    query: {
      id,
    },
  })
}

onMounted(() => {
  fetchAssessments()
})
</script>
