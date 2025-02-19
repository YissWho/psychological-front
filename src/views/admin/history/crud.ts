import {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  dict,
} from "@fast-crud/fast-crud"
import {
  getHistory
} from "../../../api/admin/history"
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
        pageRequest: getHistory
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
          form: { show: false },
          column: {
            width: 80,
            align: "center",
          },
        },
        username: {
          title: "用户名",
          type: "text",
          search: {
            show: true,
            component: {
              placeholder: "请输入",
            },
          },
          form: {show: false},
          column: {
            width: 100,
          },
        },
        assessmentTitle: {
          title: "问卷名称",
          type: "text",
          search: {
            show: true,
            component: {
              placeholder: "请输入",
            },
          },
          form: {show: false},
          column: {
            width: 150,
          },
        },
        totalScore: {
          title: "总分",
          type: "text",
          column: {
            width: 100,
          },
        },
        resultCategory: {
          title: "测评结果",
          type: "text",
          column: {
            width: 100,
          },
        },
        resultDescription: {
          title: "测评结果描述",
          type: "text",
          column: {
            width: 150,
          },
        },
        recommendation: {
          title: "测评建议",
          type: "text",
          column: {
            width: 150,
          },
        },
        createdAt: {
          title: "提交时间",
          type: "datetime",
          form: { show: false },
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