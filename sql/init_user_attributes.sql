-- Create user_attributes table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_attributes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(user_id),
    -- 城市
    city VARCHAR(50) DEFAULT '福州',
    -- 业务阶段 (参考公积金提取流程)
    phase VARCHAR(20) DEFAULT 'AA000',
    -- 是否已认证登录
    is_authenticated BOOLEAN DEFAULT false,
    -- 是否已婚
    is_married BOOLEAN DEFAULT false,
    -- 是否授权配偶信息
    spouse_authorized BOOLEAN DEFAULT false,
    -- 历史提取类型 (JSON数组: ["租房", "贷款"])
    history_extract_types JSONB DEFAULT '[]',
    -- 可提取类型 (JSON数组)
    permit_extract_types JSONB DEFAULT '["租房", "购房", "还贷", "离职", "退休"]',
    -- 是否满足提取条件
    can_extract BOOLEAN DEFAULT true,
    -- 不满足提取原因
    cannot_extract_reason VARCHAR(255),
    -- 是否完成短信签约
    sms_signed BOOLEAN DEFAULT false,
    -- 是否完成银行卡签约
    bank_card_signed BOOLEAN DEFAULT false,
    -- 当前提取类型
    current_extract_type VARCHAR(50),
    -- 当前提取类型是否需要授权
    current_type_needs_auth BOOLEAN DEFAULT false,
    -- 当前提取类型是否完成授权
    current_type_authorized BOOLEAN DEFAULT false,
    -- 是否完成提取核验
    extract_verified BOOLEAN DEFAULT false,
    -- 是否完成提取验证码验证
    extract_code_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert user attributes for existing users
INSERT INTO user_attributes (user_id, city, phase, is_authenticated, is_married, spouse_authorized, history_extract_types, permit_extract_types, can_extract, sms_signed, bank_card_signed)
VALUES 
    -- 张三: 已认证，已婚，阶段AA001（已授权登录）
    ('U001', '福州', 'AA001', true, true, true, '["租房"]', '["租房", "购房", "还贷"]', true, true, true),
    -- 李四: 未认证，阶段AA000（未授权登录）
    ('U002', '泉州', 'AA000', false, false, false, '[]', '["租房", "购房", "还贷", "离职", "退休"]', true, false, false),
    -- 王五: 已认证，未婚，阶段C001（核验通过）
    ('U003', '厦门', 'C001', true, false, false, '["购房"]', '["购房", "还贷"]', true, true, false),
    -- 赵六: 已认证，已婚但未授权配偶信息，阶段AB000
    ('U004', '莆田', 'AB000', true, true, false, '[]', '["租房", "购房"]', true, false, false)
ON CONFLICT (user_id) DO UPDATE SET
    city = EXCLUDED.city,
    phase = EXCLUDED.phase,
    is_authenticated = EXCLUDED.is_authenticated,
    is_married = EXCLUDED.is_married,
    spouse_authorized = EXCLUDED.spouse_authorized,
    history_extract_types = EXCLUDED.history_extract_types,
    permit_extract_types = EXCLUDED.permit_extract_types,
    can_extract = EXCLUDED.can_extract,
    sms_signed = EXCLUDED.sms_signed,
    bank_card_signed = EXCLUDED.bank_card_signed,
    updated_at = CURRENT_TIMESTAMP;

