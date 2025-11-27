import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  console.error("⚠️  DATABASE_URL environment variable is not set!")
  console.error("Please create a .env.local file with your database connection string.")
}

export const sql = neon(process.env.DATABASE_URL || "")

export async function authenticateUser(account: string, password: string) {
  const result = await sql`
    SELECT id, user_id, name, id_card, phone 
    FROM users 
    WHERE (id_card = ${account} OR phone = ${account}) 
    AND password = ${password}
  `
  return result[0] || null
}

export async function getUserById(userId: string) {
  const result = await sql`
    SELECT id, user_id, name, id_card, phone 
    FROM users 
    WHERE user_id = ${userId}
  `
  return result[0] || null
}

export interface UserAttributes {
  user_id: string
  city: string
  phase: string
  is_authenticated: boolean
  is_married: boolean
  spouse_authorized: boolean
  history_extract_types: string[]
  permit_extract_types: string[]
  can_extract: boolean
  cannot_extract_reason: string | null
  sms_signed: boolean
  bank_card_signed: boolean
  current_extract_type: string | null
  current_type_needs_auth: boolean
  current_type_authorized: boolean
  extract_verified: boolean
  extract_code_verified: boolean
}

export async function getUserAttributes(userId: string): Promise<UserAttributes | null> {
  const result = await sql`
    SELECT 
      user_id,
      city,
      phase,
      is_authenticated,
      is_married,
      spouse_authorized,
      history_extract_types,
      permit_extract_types,
      can_extract,
      cannot_extract_reason,
      sms_signed,
      bank_card_signed,
      current_extract_type,
      current_type_needs_auth,
      current_type_authorized,
      extract_verified,
      extract_code_verified
    FROM user_attributes 
    WHERE user_id = ${userId}
  `
  return result[0] as UserAttributes || null
}

export async function updateUserAttribute(userId: string, attributeName: string, value: unknown) {
  // Dynamic update for specific attribute
  const validColumns = [
    'city', 'phase', 'is_authenticated', 'is_married', 'spouse_authorized',
    'history_extract_types', 'permit_extract_types', 'can_extract', 
    'cannot_extract_reason', 'sms_signed', 'bank_card_signed',
    'current_extract_type', 'current_type_needs_auth', 'current_type_authorized',
    'extract_verified', 'extract_code_verified'
  ]
  
  if (!validColumns.includes(attributeName)) {
    throw new Error(`Invalid attribute name: ${attributeName}`)
  }
  
  // Use raw SQL for dynamic column update
  await sql`
    UPDATE user_attributes 
    SET ${sql(attributeName)} = ${value}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
  `
}
