export const asyncForEach = async <ITEM>(array: ITEM[], callback: (item: ITEM, index: number, array: ITEM[]) => any) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
