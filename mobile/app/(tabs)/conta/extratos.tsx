import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface Transaction {
  id: string;
  tipo: string;
  valor: number;
  descricao?: string;
  data_movimentacao: string;
  status: string;
}

export default function ExtratosScreen() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/transactions');
        const json = await res.json();
        setData(json.transactions ?? []);
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
      <ThemedText type="title">Extratos</ThemedText>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ThemedView style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' }}>
            <ThemedText type="subtitle">{item.tipo} • R$ {item.valor?.toLocaleString('pt-BR')}</ThemedText>
            {item.descricao && <ThemedText>{item.descricao}</ThemedText>}
            <ThemedText>{new Date(item.data_movimentacao).toLocaleDateString('pt-BR')}</ThemedText>
            <ThemedText>Status: {item.status}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}