<template>
  <div class="questionnaire-container">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <div class="left">
        <a-input-search
          v-model:value="searchForm.title"
          placeholder="请输入问卷名称"
          style="width: 300px"
          @search="handleSearch"
        />
        <!-- 刷新 -->
        <a-button type="default" @click="fetchData" style="margin-left: 10px">
          刷新
        </a-button>
      </div>
      <div class="left">
        <a-button type="primary" @click="handleAdd">
          新增问卷
        </a-button>
      </div>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
      size="middle"
      bordered
    >
      <!-- 自定义列渲染 -->
      <template #bodyCell="{ column, record }">
        <!-- 问卷名称列 -->
        <template v-if="column.key === 'title'">
          <a @click="handleTitleClick(record)">{{ record.title }}</a>
        </template>
        
        <!-- 创建时间列 -->
        <template v-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>

        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm
              title="确定要删除这个问卷吗？"
              @confirm="handleDelete(record)"
            >
              <a-button type="primary" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 编辑/新增弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="900px"
      :footer="null"
      :destroy-on-close="true"
      :centered="true"
      class="questionnaire-modal"
    >
      <QuestionnaireEditor
        v-if="modalVisible"
        v-model="formData"
        @cancel="handleCancel"
        @submit="handleSubmit"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { getQuestionnaires, createQuestionnaire, updateQuestionnaire, deleteQuestionnaire } from '../../../api/admin/questions'
import QuestionnaireEditor from '../../../components/QuestionnaireEditor.vue'

const router = useRouter()

// 搜索表单
const searchForm = ref({
  title: '',
})

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '问卷名称',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 300,
    ellipsis: true,
  },
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  position: ['bottomLeft'],
})

// 弹窗控制
const modalVisible = ref(false)
const modalTitle = ref('')
const formData = ref<any>(null)

// 获取表格数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getQuestionnaires({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      title: searchForm.value.title,
    })
    tableData.value = res.records
    pagination.value.total = res.total
  } catch (error: any) {
    message.error(error.message || '获取数据失败')
  } finally {
    loading.value = false
  }
}

// 表格变化处理
const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchData()
}

// 搜索处理
const handleSearch = () => {
  pagination.value.current = 1
  fetchData()
}

// 新增问卷
const handleAdd = () => {
  modalTitle.value = '新增问卷'
  formData.value = {}
  modalVisible.value = true
}

// 编辑问卷
const handleEdit = (record: any) => {
  modalTitle.value = '编辑问卷'
  formData.value = { ...record }
  modalVisible.value = true
}

// 删除问卷
const handleDelete = async (record: any) => {
  try {
    await deleteQuestionnaire(record.id)
    message.success('删除成功')
    fetchData()
  } catch (error: any) {
    console.log(error)
  }
}

// 弹窗取消
const handleCancel = () => {
  modalVisible.value = false
  formData.value = null
}

// 弹窗提交
const handleSubmit = async (data: any) => {
  try {
    if (data.id) {
      await updateQuestionnaire(data)
      message.success('更新成功')
    } else {
      await createQuestionnaire(data)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchData()
  } catch (error: any) {
    message.error(error.message || '操作失败')
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 处理问卷名称点击
const handleTitleClick = (record: any) => {
  router.push({
    name: 'ScoreList',
    query: {
      assessmentId: record.id
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.questionnaire-container {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 120px);

  .action-bar {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.ant-table-pagination) {
    margin: 16px 0;
  }

  :deep(.questionnaire-modal) {
    .ant-modal-content {
      max-height: 500px !important;
    }
  }
}
</style>