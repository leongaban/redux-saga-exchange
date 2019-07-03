import { bind } from 'decko';

export default class DocumentApi {

  @bind
  public setTitle(x: string) {
    document.title = x;
  }
}
