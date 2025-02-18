import {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  dict,
} from "@fast-crud/fast-crud"
import {
  createUser,
  deleteUser,
  updateUser,
  getUsers,
} from "../../../api/admin/users"
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
        pageRequest: getUsers,
        addRequest: async ({ form }) => {
          return await createUser(form)
        },
        editRequest: async ({ form }) => {
          return await updateUser(form)
        },
        delRequest: async ({ row }) => {
          return await deleteUser(row.id)
        },
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
      form: {
        col: { span: 12 },
        labelWidth: "100px",
        afterSubmit({ mode}) {
          console.log(mode)
          notification.success({ message: "操作成功" })
        },
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
              placeholder: "请输入用户名",
            },
          },
          form: {
            rules: [{ required: true, message: "请输入用户名" }],
            component: {
              placeholder: "请输入用户名"
            }
          },
          column: {
            width: 100,
          },
        },
        email: {
          title: "邮箱",
          type: "text",
          search: {
            show: true,
            component: {
              placeholder: "请输入邮箱",
            },
          },
          form: {
            rules: [
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入正确的邮箱格式" },
            ],
            component: {
              placeholder: "请输入邮箱"
            }
          },
          column: {
            width: 150,
          },
        },
        role: {
          title: "角色",
          type: "dict-select",
          search: {
            show: true,
            component: {
              placeholder: "请选择角色",
            },
          },
          form: {
            component: {
              placeholder: "请选择角色"
            }
          },
          dict: dict({
            data: [
              { value: "USER", label: "普通用户" },
              { value: "ADMIN", label: "管理员" },
            ],
          }),
          column: {
            width: 100,
          },
        },
        createdAt: {
          title: "创建时间",
          type: "datetime",
          form: { show: false },
          column: {
            width: 150,
          },
        },
      },
      rowHandle: {
        width: 150,
        fixed: "right",
        buttons: {
          view: {
            size: "small"
          },
          edit: {
            size: "small"
          },
          remove: {
            size: "small"
          }
        }
      },
    },
  }
}
