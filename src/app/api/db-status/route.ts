import { NextResponse } from 'next/server'
import { getPoolStatus, resetMetrics } from '@/lib/db'

export async function GET() {
  try {
    const poolStatus = getPoolStatus()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        pool: poolStatus,
        health: poolStatus.status === 'active' ? 'healthy' : 'unhealthy'
      }
    })
  } catch (error) {
    console.error('Database status check failed:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get database status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST para resetar métricas
export async function POST() {
  try {
    resetMetrics()
    
    return NextResponse.json({
      success: true,
      message: 'Metrics reset successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to reset metrics:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset metrics'
      },
      { status: 500 }
    )
  }
}