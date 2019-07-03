import * as React from 'react';
import { ClientDeviceType } from 'shared/types/ui';

export const ClientDeviceContext = React.createContext<ClientDeviceType>('desktop');
