export function prettyLog(input: any) {
  if (__DEV__) {
    console.log(JSON.stringify(input, null, 2));
  }
}
