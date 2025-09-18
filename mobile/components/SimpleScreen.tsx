import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SimpleScreen({ title }: { title: string }) {
  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 8 }}>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedText>Em breve: implementação completa desta seção.</ThemedText>
    </ThemedView>
  );
}