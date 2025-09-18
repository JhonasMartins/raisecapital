import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ContaIndex() {
  const items = [
    { href: '/(tabs)/conta/investimentos', label: 'Investimentos' },
    { href: '/(tabs)/conta/rendimentos', label: 'Rendimentos' },
    { href: '/(tabs)/conta/extratos', label: 'Extratos' },
    { href: '/(tabs)/conta/imposto', label: 'Imposto' },
    { href: '/(tabs)/conta/pagamentos', label: 'Pagamentos' },
    { href: '/(tabs)/conta/notificacoes', label: 'Notificações' },
    { href: '/(tabs)/conta/seguranca', label: 'Segurança' },
    { href: '/(tabs)/conta/assinaturas', label: 'Assinaturas' },
    { href: '/(tabs)/conta/suitability', label: 'Suitability' },
    { href: '/(tabs)/conta/documentos', label: 'Documentos' },
    { href: '/(tabs)/conta/dados-bancarios', label: 'Dados Bancários' },
    { href: '/(tabs)/conta/perfil', label: 'Perfil' },
  ];

  return (
    <ThemedView style={{ gap: 12, padding: 16 }}>
      <ThemedText type="title">Minha Conta</ThemedText>
      <ThemedText>Escolha uma seção:</ThemedText>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <ThemedText type="link">{item.label}</ThemedText>
        </Link>
      ))}
    </ThemedView>
  );
}