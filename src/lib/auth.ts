import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { query } from './db';

const scryptAsync = promisify(scrypt);

<<<<<<< HEAD
// Configurações de segurança
const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
}

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  exp: number;
  [key: string]: any; // Para compatibilidade com JWTPayload
}

/**
 * Hash de senha usando scrypt com salt aleatório
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verificação de senha contra hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(key, 'hex');
  return timingSafeEqual(derivedKey, keyBuffer);
}

/**
 * Criar JWT assinado para sessão
 */
export async function createSession(user: User): Promise<string> {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor((Date.now() + SESSION_DURATION) / 1000),
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.exp)
    .sign(JWT_SECRET);
}

/**
 * Verificar e decodificar JWT
 */
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

/**
 * Definir cookie de sessão HttpOnly
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });
}

/**
 * Remover cookie de sessão
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Obter usuário atual da sessão
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!token) return null;

    const session = await verifySession(token);
    if (!session) return null;

    // Buscar dados atualizados do usuário no banco
    const result = await query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [session.userId]
    );

    if (result.rows.length === 0) return null;

    const userRow = result.rows[0] as any;
    return {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      created_at: userRow.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Criar novo usuário
 */
export async function createUser(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  
  const result = await query(
    `INSERT INTO users (email, password_hash, name, created_at) 
     VALUES ($1, $2, $3, NOW()) 
     RETURNING id, email, name, created_at`,
    [email, hashedPassword, name]
  );

  const userRow = result.rows[0] as any;
  return {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
    created_at: userRow.created_at,
  };
}
=======
export const auth = betterAuth({
  database: dbPool,
  
  // Mapeia o core model 'user' para a tabela plural 'users' e nomes de colunas já existentes
  user: {
    modelName: 'users',
    fields: {
      image: 'avatar_url',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      emailVerified: 'email_verified',
    },
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === 'production',
    sendResetPassword: async ({ user, url }: { user: any, url: string }) => {
      const mailer = getMailer()
      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@raisecapital.com.br',
        to: user.email,
        subject: 'Redefinir senha - Raise Capital',
        html: `
          <div style="max-width:600px;margin:0 auto;padding:20px;font-family:system-ui,-apple-system,sans-serif">
            <h2>Redefinir senha</h2>
            <p>Olá! Você solicitou a redefinição de senha para sua conta na Raise Capital.</p>
            <p>Clique no link abaixo para criar uma nova senha:</p>
            <a href="${url}" style="display:inline-block;background:#04a2fa;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:10px 0">Redefinir senha</a>
            <p>Este link expira em 1 hora. Se você não solicitou esta redefinição, ignore este e-mail.</p>
          </div>
        `
      })
    },
    sendVerificationEmail: async ({ user, url }: { user: any, url: string }) => {
      const mailer = getMailer()
      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@raisecapital.com.br',
        to: user.email,
        subject: 'Verificar e-mail - Raise Capital',
        html: `
          <div style="max-width:600px;margin:0 auto;padding:20px;font-family:system-ui,-apple-system,sans-serif">
            <h2>Verificar seu e-mail</h2>
            <p>Bem-vindo(a) à Raise Capital!</p>
            <p>Clique no link abaixo para verificar seu e-mail e ativar sua conta:</p>
            <a href="${url}" style="display:inline-block;background:#04a2fa;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:10px 0">Verificar e-mail</a>
            <p>Este link expira em 24 horas.</p>
          </div>
        `
      })
    }
  },

  plugins: [],
>>>>>>> b890b5519270286ff53dcc7cbf20584a30b8b40e

/**
 * Autenticar usuário por email e senha
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await query(
    'SELECT id, email, password_hash, name, created_at FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) return null;

<<<<<<< HEAD
  const userRow = result.rows[0] as any;
  const isValid = await verifyPassword(password, userRow.password_hash);
  
  if (!isValid) return null;

  return {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
    created_at: userRow.created_at,
  };
}

/**
 * Verificar se email já existe
 */
export async function emailExists(email: string): Promise<boolean> {
  const result = await query('SELECT 1 FROM users WHERE email = $1', [email]);
  return result.rows.length > 0;
}

/**
 * Validar formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar força da senha
 */
export function isValidPassword(password: string): boolean {
  // Mínimo 8 caracteres, pelo menos 1 letra e 1 número
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
