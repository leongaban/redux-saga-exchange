import { actions } from 'services/user';
import { MakeApiErrorInterceptors } from 'shared/types/errors';
import routes from '../../routes';

const handleSessionExpired: MakeApiErrorInterceptors = dispatch => ({ status }) => {
  if (status === 401) {
    if (document.location.pathname.includes(routes.admin.getElementKey())) {
      dispatch(actions.adminLogout());
    } else {
      dispatch(actions.logout());
    }
  }
};

export default handleSessionExpired;
