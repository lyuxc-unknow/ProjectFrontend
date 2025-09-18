export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
) {
  let timeout: any;
  return function(this: any, ...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as T;
}


