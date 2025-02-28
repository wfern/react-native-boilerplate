import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';

export function NotFound() {
  return (
    <View style={styles.container}>
      <Text>404</Text>
      <Button screen="HomeTabs">Go to Home</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
