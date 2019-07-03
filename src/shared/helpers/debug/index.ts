const params = ((search: string) => {
  const paramsHash: {[key: string]: string} = {};
  (search.split('?').pop() || '')
    .split('&').map((pairStr: string) => {
      const pair: string[] = pairStr.split('=');
      if (pair[0] !== '') {
        paramsHash[pair[0]] = pair[1];
      }
    });

  return {
    get(name: string) {
      return paramsHash[name];
    },
    exists(name: string) {
      return name in paramsHash;
    },
  };
})(document.location.search || '');

const isDebug: boolean = params.exists('dodebug');

function envLogger(module: string, logKey: string) {
  const debugKey = params.get('dodebug');
  const logEnabled: boolean = isDebug && (debugKey === 'all' || debugKey.split(',').indexOf(logKey) >= 0);
  const cons = logEnabled ? console : {
    log: () => null,
    debug: () => null,
    error: () => null,
    trace: () => null,
  };
  return {
    log(...args: any[]) {
      cons.log.apply(cons, args);
    },
  };
}

export { envLogger };
