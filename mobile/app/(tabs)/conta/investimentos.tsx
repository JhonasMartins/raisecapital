import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface Investment {
  id: string;
  nome: string;
  valor_investido: number;
  valor_atual?: number;
  status: string;
  slug?: string;
}

export default function InvestimentosScreen() {
  const [data, setData] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/investments');
        const json = await res.json();
        setData(json.investments ?? []);
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
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Investimentos</ThemedText>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ThemedView style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' }}>
            <ThemedText type="subtitle">{item.nome}</ThemedText>
            <ThemedText>Valor investido: R$ {item.valor_investido?.toLocaleString('pt-BR')}</ThemedText>
            {item.valor_atual != null && (
              <ThemedText>Valor atual: R$ {item.valor_atual?.toLocaleString('pt-BR')}</ThemedText>
            )}
            <ThemedText>Status: {item.status}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}