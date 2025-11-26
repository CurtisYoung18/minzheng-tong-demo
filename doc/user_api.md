# 用户概述

用户是指 Agent 发起对话的终端用户，GPTBots 支持开发者为不同用户设置唯一身份标识ID，通过该用户ID`user_id`可以在不同渠道之间进行用户身份关联，实现跨渠道用户身份合并、通过 Tools 实现业务业务查询、维护用户属性和聊天记录等功能。

## 定义

### 用户
用户是指与 Agent 产生对话的终端用户。

### 用户ID（user_id）
由企业开发者为终端用户所赋予的身份唯一标识ID，通过 API 接口支持开发者为某个匿名ID设置UserId。

- user_id级别高于anonymous_id
- 多个anonymous_id可以同时属于一个user_id

### 匿名ID（anonymous_id）
用户在三方平台（如：Telegram、WhatsApp、LINE等）与 Agent 进行对话时，GPTBots 会使用该三方平台的用户惟一标识符作为anonymous_id。

### 对话ID（conversation_id）
对话ID（conversation_id）由 Agent、对话类型和 user_id（anonymous_id）所共同生成的惟一标识ID，conversationID是不同业务场景隔离的最小单位（通常包含多个消息ID）。

- conversationID 的自动过期时间为 60分钟,但通过 API 渠道生成的conversationID 没有过期时间。

### 消息ID（message_id）
消息ID 即messageID用于标识 Agent 与用户的一次对话消息，是 Agent 与用户的一次对话的最小单位。

## 设置用户ID

### API 设置用户ID

请求方式: `POST`

请求地址: `https://api-${endpoint}.gptbots.ai/v1/conversation`

请求示例:
\`\`\`bash
curl -X POST "https://api-${endpoint}.gptbots.ai/v1/conversation" \ 
-H 'Authorization: Bearer ${API Key}' \
-H 'Content-Type: application/json' \ 
-d '{
      "user_id": "your_user_id"
}'
\`\`\`

## 更新用户属性

请求方式: `POST`

调用地址: `https://api-${endpoint}.gptbots.ai/v1/property/update`

请求参数:
| 参数 | 类型 | 说明 | required |
| --- | --- | --- | --- |
| user_id | string | 需要设置用户属性的用户id | true |
| property_values | list | 待更新的属性列表 | true |
| property_values.property_name | string | 属性名称 | true |
| property_values.value | object | 属性值 | true |

## 查询用户属性

请求方式: `GET`

调用地址: `https://api-${endpoint}/v2/user-property/query`

请求参数:
| 参数 | 类型 | 说明 | required |
| --- | --- | --- | --- |
| user_ids | string | 需要查询用户属性的用户id | 必填，与anonymous_ids二选一 |
| anonymouse_ids | string | 需要查询用户属性的匿名用户id | 必填，与user_ids二选一 |
