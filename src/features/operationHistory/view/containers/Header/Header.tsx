import React from 'react';
import * as block from 'bem-cn';
import { connect } from 'react-redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

import { IAppReduxState } from 'shared/types/app';
import { normalizeDate } from 'shared/helpers/normalizers';
import { Button } from 'shared/view/elements';
import { IDateInputFieldProps, DateInputField, IInputFieldProps, InputField } from 'shared/view/redux-form';
import moment from 'services/moment';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { ClientDeviceContext } from 'services/config';

import { selectors, operationsFilterFormEntry } from '../../../redux';
import * as NS from '../../../namespace';
import './Header.scss';

interface IStateProps {
  fromDate?: number;
  toDate?: number;
}

function mapState(state: IAppReduxState): IStateProps {
  const formData = selectors.selectFormValues(state);
  return {
    fromDate: formData && formData.fromDate,
    toDate: formData && formData.toDate,
  };
}

type IProps = IStateProps & InjectedFormProps<NS.IFilterForm> & ITranslateProps;

interface IDateInputRenderArguments {
  fieldName: string;
  minDate?: number;
  maxDate?: number;
  id?: string;
  doesStoreEndOfDay?: boolean;
}

const b = block('operation-history-header');

class Header extends React.PureComponent<IProps> {
  public render() {
    const { toDate, fromDate, reset, translate: t } = this.props;

    return (
      <ClientDeviceContext.Consumer>
        {device => (
          <div className={b()}>
            <div className={b('controls')()}>
              <div className={b('search')()}>
                <Field<IInputFieldProps>
                  component={InputField}
                  name={operationsFilterFormEntry.fieldNames.search}
                  placeholder={t('SHARED:BUTTONS:SEARCH')}
                  extent="middle"
                  search
                />
              </div>
              {
                device === 'desktop' && (
                  <>
                    <div className={b('range-start-date')()}>
                      {this.renderDateInput({
                        fieldName: operationsFilterFormEntry.fieldNames.fromDate,
                        maxDate: toDate,
                      })}
                    </div>
                    <span>&mdash;</span>
                    <div className={b('range-end-date')()}>
                      {this.renderDateInput({
                        fieldName: operationsFilterFormEntry.fieldNames.toDate,
                        doesStoreEndOfDay: true,
                        minDate: fromDate,
                      })}
                    </div>
                    <div className={b('reset-button')()}>
                      <Button color="black-white" onClick={reset}>
                        {t('SHARED:BUTTONS:RESET')}
                      </Button>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        )}
      </ClientDeviceContext.Consumer>
    );
  }

  private renderDateInput({
    id,
    doesStoreEndOfDay,
    fieldName,
    minDate,
    maxDate,
  }: IDateInputRenderArguments) {
    return (
      <div className={b('date-input-field')()}>
        <Field<IDateInputFieldProps>
          component={DateInputField}
          id={id}
          name={fieldName}
          placeholder="dd/mm/yyyy"
          maxDate={maxDate === undefined ? moment() : moment(maxDate)}
          minDate={minDate === undefined ? undefined : moment(minDate)}
          extent="small"
          doesStoreEndOfDay={doesStoreEndOfDay}
          format={normalizeDate}
        />
      </div>
    );
  }
}

export default (
  reduxForm<NS.IFilterForm>({
    form: operationsFilterFormEntry.name,
  })(
    connect(mapState, () => ({}))(
      i18nConnect(
        Header
      ))));
