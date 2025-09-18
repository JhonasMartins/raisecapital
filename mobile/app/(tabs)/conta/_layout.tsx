import { Stack } from 'expo-router';

export default function ContaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minha Conta' }} />
      <Stack.Screen name="investimentos" options={{ title: 'Investimentos' }} />
      <Stack.Screen name="rendimentos" options={{ title: 'Rendimentos' }} />
      <Stack.Screen name="extratos" options={{ title: 'Extratos' }} />
      <Stack.Screen name="imposto" options={{ title: 'Imposto' }} />
      <Stack.Screen name="pagamentos" options={{ title: 'Pagamentos' }} />
      <Stack.Screen name="notificacoes" options={{ title: 'Notificações' }} />
      <Stack.Screen name="seguranca" options={{ title: 'Segurança' }} />
      <Stack.Screen name="assinaturas" options={{ title: 'Assinaturas' }} />
      <Stack.Screen name="suitability" options={{ title: 'Suitability' }} />
      <Stack.Screen name="documentos" options={{ title: 'Documentos' }} />
      <Stack.Screen name="dados-bancarios" options={{ title: 'Dados bancários' }} />
      <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Stack>
  );
}