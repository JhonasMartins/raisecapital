import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface Overview {
  balanceAvailable: number;
  investedTotal: number;
  cumulativeReturnPct: number;
  pendingContributions: number;
}

export default function RendimentosScreen() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/conta/overview');
        const json = await res.json();
        setData(json);
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 12 }}>
      <ThemedText type="title">Rendimentos</ThemedText>
      {data && (
        <>
          <ThemedText>Saldo disponível: R$ {data.balanceAvailable?.toLocaleString('pt-BR')}</ThemedText>
          <ThemedText>Total investido: R$ {data.investedTotal?.toLocaleString('pt-BR')}</ThemedText>
          <ThemedText>Rentabilidade acumulada: {data.cumulativeReturnPct?.toFixed(2)}%</ThemedText>
          <ThemedText>Aportes pendentes: R$ {data.pendingContributions?.toLocaleString('pt-BR')}</ThemedText>
        </>
      )}
    </ThemedView>
  );
}