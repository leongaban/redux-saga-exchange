import { IDependencies } from 'shared/types/app';

import Api from 'services/api/Api';
import Sockets from 'services/sockets/SocketsLib';

export default function configureDeps(): IDependencies {
  const api = new Api();
  const sockets = new Sockets();

  return { api, sockets };
}
