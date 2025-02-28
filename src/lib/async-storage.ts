import NativeAsyncStorage from '@react-native-async-storage/async-storage';

export const AsyncStorage = {
  // Destructuring don't work in new architecture in bridgeless mode
  // ...NativeAsyncStorage,
  //
  removeItem: NativeAsyncStorage.removeItem,
  //
  setItem(key: string, value: any) {
    return NativeAsyncStorage.setItem(key, JSON.stringify(value));
  },
  async getItem<T = string | null>(key: string): Promise<T | null> {
    const value = await NativeAsyncStorage.getItem(key);

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  },
};
