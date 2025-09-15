import { redirect } from "next/navigation";

export default function InvestorDashboardRedirect() {
  // Esta rota não é usada. Redirecionamos permanentemente para o dashboard do investidor em /conta
  redirect("/conta");
}