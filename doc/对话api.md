# 对话API文档

## 创建对话ID

用于请求创建并获取一个`conversation_id`，该 ID 是用户与Agent进行对话的标识符ID。

### 请求方式
`POST`

### 调用地址
`https://api-${endpoint}.gptbots.ai/v1/conversation`

### 请求头
| 字段 | 类型 | 描述 |
| --- | --- | --- |
| Authorization | Bearer ${API Key} | 使用Authorization: Bearer ${API Key}进行调用验证 |
| Content-Type | application/json | 数据类型 |

### 请求参数
| 字段 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| user_id | string | 是 | 用户标识，最长 32 字符 |

### 响应
| 字段 | 类型 | 描述 |
| --- | --- | --- |
| conversation_id | string | 对话标识符 |

---

## 发送消息

通过本 API 可以向指定的 `conversation_id` 发送消息，并获取 Agent 生成的响应信息。支持文本、图片、音频和文档。

### 请求方式
`POST`

### 调用地址
`https://api-${endpoint}.gptbots.ai/v2/conversation/message`

### 请求参数
| 字段 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| conversation_id | string | 是 | 对话唯一标识符 |
| response_mode | string | 是 | blocking/streaming/webhook |
| messages | JSON Array | 是 | 对话消息内容 |

### Messages 内容格式

\`\`\`json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "你的问题"
        },
        {
          "type": "image",
          "image": [
            {
              "base64_content": "<base64_string>",
              "format": "jpeg",
              "name": "图片名称"
            }
          ]
        },
        {
          "type": "audio",
          "audio": [
            {
              "base64_content": "<base64_string>",
              "format": "mp3",
              "name": "音频名称"
            }
          ]
        },
        {
          "type": "document",
          "document": [
            {
              "base64_content": "<base64_string>",
              "format": "pdf",
              "name": "文档名称"
            }
          ]
        }
      ]
    }
  ]
}
\`\`\`

### 流式响应格式
| code | message | 描述 |
| --- | --- | --- |
| 3 | Text | 文本类型 |
| 10 | FlowOutput | Flowagent 输出 |
| 0 | End | 结束标识 |
| 4 | Cost | 消耗数据 |
| 11 | MessageInfo | 消息信息 |
| 39 | Audio | 语音消息 |

### 支持的文件格式
- Text消息：string
- Audio消息：.mp3, .wav
- Image消息：.jpg, .jpeg, .png, .gif, .webp
- Document消息：.pdf, .txt, .docx, .csv, .xlsx, .html, .json, .md 等
