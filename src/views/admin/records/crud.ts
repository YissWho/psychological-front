import {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  dict,
} from "@fast-crud/fast-crud"
import {
  getRecords
} from "../../../api/admin/records"
import { notification } from "ant-design-vue"

/**
 * 定义一个CrudOptions生成器方法
 */
export default function ({
  expose,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: getRecords
      },
      search: {
        show: true,
        container: {
          action: {
            col: {
              span: 8,
            },
          },
        },
        buttons: {
          search: {
            text: "查询",
          },
          reset: {
            text: "重置",
          },
        },
      },
      table: {
        border: true,
        stripe: true,
        rowKey: "id",
        scroll: { x: 'max-content' },
        size: "small",
      },
      pagination: {
        pageSize: 10,
      },
      actionbar: {
        show: false,
      },
      columns: {
        id: {
          title: "ID",
          type: "number",
          column: {
            width: 80,
            align: "center",
          },
        },
        userId: {
          title: "用户ID",
          type: "number",
          column: {
            width: 80,
            align: "center",
          },
        },
        name: {
          title: "用户名",
          type: "text",
          search: {
            show: true,
            component: {
              placeholder: "请输入",
            },
          },
          column: {
            width: 100,
          },
        },
        gender: {
          title: "性别",
          type: "dict-select",
          search: {
            show: true,
            component: {
              placeholder: "请选择",
            },
          },
          column: {
            width: 150,
          },
          dict: dict({
            data: [
              { value: "MALE", label: "男" },
              { value: "FEMALE", label: "女" },
            ],
          }),
        },
        age: {
          title: "年龄",
          type: "text",
          column: {
            width: 100,
          },
        },
        occupation: {
          title: "职业",
          type: "text",
          column: {
            width: 100,
          },
        },
        stressLevel: {
          title: "压力水平",
          type: "dict-select",
          column: {
            width: 150,
          },
          search: {
            show: true,
            component: {
              placeholder: "请选择",
            },
          },
          dict: dict({
            data: [
              { value: "LOW", label: "低" },
              { value: "MEDIUM", label: "中" },
              { value: "HIGH", label: "高" },
            ],
          }),
        },
        sleepQuality: {
          title: "睡眠质量",
          type: "dict-select",
          column: {
            width: 150,
          },
          search: {
            show: true,
            component: {
              placeholder: "请选择",
            },
          },
          dict: dict({
            data: [
              { value: "LOW", label: "低" },
              { value: "MEDIUM", label: "中" },
              { value: "HIGH", label: "高" },
            ],
          }),
        },
        emotionalState: {
          title: "情绪状态",
          type: "text",
          column: {
            width: 150,
          },
        },
        notes: {
          title: "备注",
          type: "text",
          column: {
            width: 150,
          },
        },
      },
      rowHandle: {
        show: false,
      },
    },
  }
}