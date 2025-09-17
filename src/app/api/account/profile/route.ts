import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { query } from '@/lib/db'

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({} as any))

    // Mapear campos recebidos do formulário de investimento
    const nome: string | undefined = body?.nome
    const sobrenome: string | undefined = body?.sobrenome
    const cpfRaw: string | undefined = body?.cpf
    const cnpjRaw: string | undefined = body?.cnpj

    const updates: string[] = []
    const values: any[] = [user.id]
    let idx = 2

    // Atualiza nome completo se informado
    if ((typeof nome === 'string' && nome.trim()) || (typeof sobrenome === 'string' && sobrenome.trim())) {
      const displayName = [nome, sobrenome].filter(Boolean).join(' ').trim()
      if (displayName) {
        updates.push(`name = $${idx}`)
        values.push(displayName)
        idx++
      }
    }

    // Atualiza CPF (PF)
    if (typeof cpfRaw === 'string' && cpfRaw.trim()) {
      const cpf = cpfRaw.replace(/\D/g, '')
      if (cpf.length >= 11) {
        updates.push(`cpf = $${idx}`)
        values.push(cpf)
        idx++
      }
    }

    // Atualiza CNPJ (PJ) se vier no payload
    if (typeof cnpjRaw === 'string' && cnpjRaw.trim()) {
      const cnpj = cnpjRaw.replace(/\D/g, '')
      if (cnpj.length >= 14) {
        updates.push(`cnpj = $${idx}`)
        values.push(cnpj)
        idx++
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ updated: false })
    }

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING id, email, name, cpf, cnpj, tipo_pessoa`
    const result = await query(sql, values)

    return NextResponse.json({ updated: true, user: result.rows?.[0] ?? null })
  } catch (e) {
    console.error('PATCH /api/account/profile error', e)
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
  }
}