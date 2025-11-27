-- =====================================================
-- 公积金边聊边办 - 数据库初始化脚本 (合并版)
-- 用于本地部署演示
-- =====================================================

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    id_card VARCHAR(18) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建公积金账户信息表
CREATE TABLE IF NOT EXISTS account_info (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(user_id),
    
    -- 个人基础信息
    personal_account VARCHAR(50) NOT NULL,
    open_date DATE NOT NULL,
    paid_until VARCHAR(20) NOT NULL,
    id_type VARCHAR(20) DEFAULT '身份证',
    id_number VARCHAR(50) NOT NULL,
    residence VARCHAR(50) NOT NULL,
    marital_status VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    bank_account VARCHAR(50) NOT NULL,
    
    -- 公积金缴存信息
    account_type VARCHAR(30) DEFAULT '公积金账户',
    account_status VARCHAR(20) NOT NULL,
    seal_date DATE,
    deposit_base DECIMAL(10,2) NOT NULL,
    personal_rate VARCHAR(10) NOT NULL,
    personal_amount DECIMAL(10,2) NOT NULL,
    company_rate VARCHAR(10) NOT NULL,
    company_amount DECIMAL(10,2) NOT NULL,
    
    -- 单位信息
    company_name VARCHAR(100) NOT NULL,
    company_account VARCHAR(50) NOT NULL,
    
    -- 账户余额
    total_balance DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建用户属性表 (用于业务流程控制)
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

-- =====================================================
-- 插入测试数据
-- =====================================================

-- 用户数据
INSERT INTO users (id, user_id, name, id_card, phone, password) 
VALUES 
    (1, 'U001', '张三', '350102199001011234', '13800138001', 'admin123'),
    (2, 'U002', '李四', '350102199202022345', '13800138002', 'admin123'),
    (3, 'U003', '王五', '350102199303033456', '13800138003', 'admin123'),
    (4, 'U004', '赵六', '350102199404044567', '13800138004', 'admin123')
ON CONFLICT (user_id) DO UPDATE SET
    name = EXCLUDED.name,
    id_card = EXCLUDED.id_card,
    phone = EXCLUDED.phone,
    password = EXCLUDED.password;

-- 公积金账户信息
INSERT INTO account_info (
    user_id, personal_account, open_date, paid_until, id_type, id_number, 
    residence, marital_status, phone, bank_name, bank_account,
    account_type, account_status, seal_date, deposit_base, personal_rate, 
    personal_amount, company_rate, company_amount,
    company_name, company_account, total_balance
) VALUES 
-- 张三 (U001) - 封存账户
(
    'U001', '12****789', '2020-05-05', '2022-05', '身份证', '35**************345',
    '福州', '已婚', '157****9013', '中国工商银行', '6214 **** **** 1234',
    '公积金账户', '封存', '2022-06-05', 5000.00, '12%',
    600.00, '12%', 600.00,
    '福州测试公司', '12**********123', 72000.00
),
-- 李四 (U002) - 正常账户
(
    'U002', '12****456', '2019-03-15', '2024-11', '身份证', '35**************678',
    '厦门', '未婚', '138****2002', '中国建设银行', '6227 **** **** 5678',
    '公积金账户', '正常', NULL, 8000.00, '12%',
    960.00, '12%', 960.00,
    '厦门科技有限公司', '35**********456', 138240.00
),
-- 王五 (U003) - 正常账户
(
    'U003', '12****321', '2021-08-20', '2024-11', '身份证', '35**************901',
    '泉州', '已婚', '159****3003', '中国农业银行', '6228 **** **** 9012',
    '公积金账户', '正常', NULL, 6500.00, '10%',
    650.00, '10%', 650.00,
    '泉州贸易有限公司', '35**********789', 50700.00
),
-- 赵六 (U004) - 封存账户
(
    'U004', '12****654', '2018-01-10', '2023-08', '身份证', '35**************234',
    '漳州', '离异', '186****4004', '招商银行', '6225 **** **** 3456',
    '公积金账户', '封存', '2023-09-01', 4500.00, '8%',
    360.00, '8%', 360.00,
    '漳州物流有限公司', '35**********012', 48960.00
)
ON CONFLICT (user_id) DO UPDATE SET
    personal_account = EXCLUDED.personal_account,
    open_date = EXCLUDED.open_date,
    paid_until = EXCLUDED.paid_until,
    id_number = EXCLUDED.id_number,
    residence = EXCLUDED.residence,
    marital_status = EXCLUDED.marital_status,
    phone = EXCLUDED.phone,
    bank_name = EXCLUDED.bank_name,
    bank_account = EXCLUDED.bank_account,
    account_status = EXCLUDED.account_status,
    seal_date = EXCLUDED.seal_date,
    deposit_base = EXCLUDED.deposit_base,
    personal_rate = EXCLUDED.personal_rate,
    personal_amount = EXCLUDED.personal_amount,
    company_rate = EXCLUDED.company_rate,
    company_amount = EXCLUDED.company_amount,
    company_name = EXCLUDED.company_name,
    company_account = EXCLUDED.company_account,
    total_balance = EXCLUDED.total_balance,
    updated_at = CURRENT_TIMESTAMP;

-- 用户属性数据
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_account_info_user_id ON account_info(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attributes_user_id ON user_attributes(user_id);

-- 重置序列
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- =====================================================
-- 验证数据
-- =====================================================
SELECT 
    u.name as 用户姓名,
    u.phone as 手机号,
    a.account_status as 账户状态,
    a.total_balance as 账户余额,
    ua.city as 城市,
    ua.phase as 业务阶段
FROM users u
LEFT JOIN account_info a ON u.user_id = a.user_id
LEFT JOIN user_attributes ua ON u.user_id = ua.user_id
ORDER BY u.id;

