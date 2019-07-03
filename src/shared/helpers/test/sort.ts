
export function makeDescendDateSortChecker<T>(prop: keyof T) {
  return (x: T, index: number, array: T[]) => {
    if (index < array.length - 1) {
      return new Date(x[prop] as any).getTime() >= new Date(array[index + 1][prop] as any).getTime();
    }
    return true;
  };
}
