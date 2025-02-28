import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { axios } from '@/lib/axios';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Header, HeaderBackButton, HeaderTitle } from '@/components/header';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Pressable } from '@/components/pressable';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/text';
import { testNetwork } from '@/utils/test-network';

export function Developer() {
  const [currentHost, setCurrentHost] = React.useState(axios.defaults.baseURL);
  const [host, setHost] = React.useState('http://');

  const [networkResults, setNetworkResults] = React.useState<
    { host: string; ok: boolean }[]
  >([]);

  const handleHostInputChange = (text: string) => {
    setHost(text);
  };

  const handleHostSubmit = () => {
    axios.defaults.baseURL = host;
    setCurrentHost(host);
  };

  const handleHostUpdate = (host: string) => {
    axios.defaults.baseURL = host;
    setCurrentHost(host);
    setHost('http://');
  };

  useFocusEffect(
    React.useCallback(() => {
      setCurrentHost(axios.defaults.baseURL);
    }, []),
  );

  const handleTestNetwork = async () => {
    const results = await testNetwork();
    setNetworkResults(
      results.map((result) =>
        result.status === 'fulfilled' ? result.value : result.reason,
      ),
    );
  };

  return (
    <SafeAreaView>
      <Header>
        <HeaderBackButton />
        <HeaderTitle>Developer</HeaderTitle>
      </Header>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="p-5"
      >
        <View className="flex gap-4">
          <Text>Current Host: {currentHost}</Text>
          <View>
            <Label>Host URL</Label>
            <View className="mb-4 flex flex-row items-center gap-2">
              <Input
                className="flex-1"
                value={host}
                onChangeText={handleHostInputChange}
              />
              <Button variant="filled" onPress={handleHostSubmit}>
                Change Host
              </Button>
            </View>
            <View className="flex gap-4">
              <Button
                size="sm"
                onPress={() => {
                  handleHostUpdate('http://10.0.2.2:8000/api');
                }}
              >
                Update to "http://10.0.2.2:8000/api"
              </Button>
              <Button
                size="sm"
                onPress={() => {
                  handleHostUpdate('http://127.0.0.1:8000/api');
                }}
              >
                Update to "http://127.0.0.1:8000/api"
              </Button>
              <Button
                size="sm"
                onPress={() => {
                  handleHostUpdate('https://google.com');
                }}
              >
                Update to "https://google.com"
              </Button>
            </View>
          </View>
        </View>
        <Divider className="my-6" />
        <View className="flex gap-4">
          <Button size="sm" onPress={handleTestNetwork}>
            Test network hosts
          </Button>
          <View className="flex gap-1 rounded-xl border-card-border bg-card p-4">
            {networkResults.map((result) => (
              <View
                key={result.host}
                className="mb-1 flex flex-row justify-between gap-2 border-b border-border pb-2"
              >
                <Text>{result.host}</Text>
                <Text>{result.ok ? 'Ok' : 'Error'}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function DeveloperButton({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();

  const tapsRef = React.useRef(0);

  const handlePress = () => {
    tapsRef.current++;

    if (tapsRef.current >= 3) {
      tapsRef.current = 0;
      navigation.navigate('Developer');
    }
  };

  return <Pressable onPress={handlePress}>{children}</Pressable>;
}
