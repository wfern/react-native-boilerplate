export async function testNetwork(port: number = 8000) {
  const hosts = [
    `http://10.0.2.2:${port}`, // Android Emulator localhost
    `http://127.0.0.1:${port}`, // Local loopback
    `http://localhost:${port}`, // Local hostname
    `http://192.168.0.1:${port}`, // Common local network
    `https://google.com`, // Production
  ];

  const testResults = await Promise.allSettled(
    hosts.map(async (host) => {
      try {
        const response = await fetch(`${host}`, {
          method: 'GET',
        });
        return {
          host,
          status: response.status,
          ok: true,
        };
      } catch (error) {
        return {
          host,
          error: error instanceof Error ? error.message : 'Unknown error',
          ok: false,
        };
      }
    }),
  );

  testResults.forEach((result) => {
    console.log('Network Result:', {
      value: result.status === 'fulfilled' ? result.value : result.reason,
    });
  });

  return testResults;
}
