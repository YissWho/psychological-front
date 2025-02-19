<template>
  <div class="page-container">
    <a-card class="content-card">
      <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding" />
      </fs-page>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useFs } from "@fast-crud/fast-crud"
import createCrudOptions from "./crud"

const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions })

onMounted(() => {
  crudExpose.doRefresh()
})
</script>

<style scoped lang="less">
.page-container {
  height: calc(100vh - 120px);
  background-color: #f0f2f5;
  background: #fff;

  .content-card {
    height: 100%;
    border: 0px solid #f0f0f0 !important;
    width: 100% !important;

    :deep(.ant-card-body) {
      height: 100%;
      padding: 24px;
    }

    :deep(.fs-crud-container) {
      .fs-crud-header {
        .fs-crud-toolbar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-right: 17px !important;
          flex: 1;
        }
      }

      .fs-crud-table {
        height: 100%;
        width: 98.1%;
      }
    }
  }
}
</style>
