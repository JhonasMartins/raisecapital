import { redirect } from 'next/navigation'

interface InvestmentFlowPageProps {
  params: Promise<{ id: string }>
}

export default async function InvestmentFlowPage({ params }: InvestmentFlowPageProps) {
  const { id } = await params
  
  // Redirecionar para a primeira etapa do wizard
  redirect(`/investir/${id}/valor`)
}