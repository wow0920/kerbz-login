import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView className="items-center justify-center flex-1 p-5">
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo className="py-4 mt-4">
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}
