export function getTickValues(data: any[], key: string) {
  return data.reduce((acc, item) => {
    if (!acc.includes(item[key])) {
      acc.push(item[key]);
    }
    return acc;
  }, [] as number[]);
}

export function getTickCount(data: any[], key?: string) {
  return data.reduce((acc, item, index) => {
    if (key && !acc.includes(item[key])) {
      acc.push(item[key]);
    } else {
      acc.push(index);
    }
    return acc;
  }, [] as number[]).length;
}
