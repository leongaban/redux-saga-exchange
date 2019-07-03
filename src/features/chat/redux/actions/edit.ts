import * as NS from '../../namespace';

export function copyToMessage(message: string): NS.ICopyToMessage {
  return { type: 'CHAT:COPY_TO_MESSAGE', payload: message };
}

export function submitSearchForm(form: NS.ISearchForm): NS.ISubmitSearchForm {
  return { type: 'CHAT:SUBMIT_SEARCH_FORM', payload: form };
}
