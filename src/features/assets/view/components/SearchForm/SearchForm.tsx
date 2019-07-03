import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

import { IInputFieldProps, InputField } from 'shared/view/redux-form';

import { assetsSearchFormEntry } from '../../../redux/reduxFormEntries';
import { IAssetsSearchForm } from '../../../namespace';
import { i18nConnect, ITranslateProps } from 'services/i18n';

class SearchForm extends React.PureComponent<InjectedFormProps<IAssetsSearchForm> & ITranslateProps> {

  public render() {
    const { translate: t } = this.props;
    return (
      <form>
        <Field<IInputFieldProps>
          search
          extent="middle"
          component={InputField}
          placeholder={t('SHARED:BUTTONS:SEARCH')}
          name={assetsSearchFormEntry.fieldNames.search}
        />
      </form>
    );
  }
}

export default reduxForm<IAssetsSearchForm>({
  form: assetsSearchFormEntry.name,
})(i18nConnect(SearchForm));
