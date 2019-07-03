export const checkForMessageCompletedEvent = (event: string) =>
  event.match(/\.([^\.]+)$/)![1] === 'completed';
