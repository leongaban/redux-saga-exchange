import * as React from 'react';
import { NavLink } from 'react-router-dom';
import routes from 'modules/routes';
import { bind } from 'decko';
import block from 'bem-cn';
import { Button, Checkbox, Link } from 'shared/view/elements';
import termsContentDataJson from './Content';
import definitionDataJson from './DefinitionContent';

import './LPtermsOfService.scss';
import './LPtermsTable.scss';
import './LPtermsList.scss';

const b = block('lp-terms-of-service');
const tableB = block('lp-terms-table');
const listB = block('lp-terms-list');

interface IProps {
  setUseLiquidityPool(value: boolean): void;
}

interface IState {
  checked: boolean;
}

interface IContent {
  title: string;
  list?: Content[];
  withoutBullet?: boolean;
  table?: {
    [key: string]: any // TODO: change type to string | string[]
  };
  defs?: {
    [key: string]: any // TODO: change type to Content
  };
}

type Content = IContent | string;
// tslint:disable:max-line-length
const content: Content[] = termsContentDataJson;
const definitionContent: Content[] = definitionDataJson;

const indexOfCharBeforeLetterA = 96;
const bulletClass = listB('bullet')();
const paragraphClass = listB('paragraph')();
const indentedListClass = listB('indented-list')();
const classCell = tableB('cell')();
const classPara = b('paragraph')();
const classParaBold = b('paragraph--bold')();
const classParaPart = b('paragraph-part')();

const mapLevelToClass = [
  listB('first-level')(),
  listB('second-level')(),
  listB('third-level')()
];

const roman: any = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1
};

const toRoman = (value: number) => {
  let str = '';
  for (const i of Object.keys(roman)) {
    const q = Math.floor(value / roman[i]);
    value -= q * roman[i];
    str += i.repeat(q);
  }

  return str;
};

const getBullet = (
  level: number,
  order: number,
  parentOrder?: number
): string => {
  switch (level) {
    case 0: return String(order);
    case 1: return `${parentOrder}.${order}`;
    case 2: return `(${String.fromCharCode(indexOfCharBeforeLetterA + order)})`;
    case 3: return `(${toRoman(order).toLocaleLowerCase()})`;
    default: return '';
  }
};

const createListItem = (
  itemData: Content,
  level: number,
  order: number,
  parentOrder: number,
): JSX.Element => {
  const bullet = <span className={bulletClass}>{getBullet(level, order, parentOrder)}</span>;
  const elementKey = `${level}${parentOrder}${order}`;
  if (typeof itemData === 'object') {
    return (
      <li
        className={mapLevelToClass[level]}
        key={elementKey}
      >
        <p className={paragraphClass}>
          {!itemData.withoutBullet && bullet}
          <span className={classParaPart}>{itemData.title}</span>
        </p>
        {itemData.table && <table className={tableB()}>
          <tbody>
            {Object.keys(itemData.table).map(key => (<tr key={key}>
              <td className={`${classParaBold} ${classCell}`}>{key}</td>
              {typeof itemData.table![key] === 'object' ?
                itemData.table![key].map((cell: string, index: number) =>
                  <td className={classCell} key={index}>{cell}</td>) :
                <td className={classCell}>{itemData.table![key]}</td>}
            </tr>))}
          </tbody>
        </table>}
        {itemData.defs &&
          <ol className={indentedListClass}>
            {
              Object.keys(itemData.defs).map(key => (
                <li className={classPara} key={key}>
                  {
                    typeof itemData.defs![key] === 'object' ?
                      [
                        <p className={classPara} key="list-item-para">
                          <b className={classParaBold}>{key}</b>
                          {itemData.defs![key].title}
                        </p>,
                        (<ol className={indentedListClass} key="ordered-list">
                          {itemData.defs![key].list.map((item: any, index: number) =>
                            createListItem(item, 2, index + 1, 0))}
                        </ol>)
                      ] :
                      <p className={classPara}>
                        <b className={classParaBold}>{key}</b>
                        {itemData.defs![key]}
                      </p>
                  }
                </li>))
            }
          </ol>
        }
        {itemData.list && <ol className={indentedListClass}>
          {itemData.list.map((item, index) =>
            createListItem(item, level + 1, index + 1, order))}
        </ol>}
      </li>);
  }
  return (
    <li className={mapLevelToClass[level]} key={elementKey}>
      <p className={paragraphClass}>{bullet}<span className={classParaPart}>{itemData}</span></p>
    </li>);
};

class LPtermsOfService extends React.PureComponent<IProps, IState> {
  public state: IState = {
    checked: false
  };
  public render() {
    const pathToTrade = routes.trade.classic.getPath();

    return (
      <div className={b('cell')()}>
        <article className={b('cell-block')()}>
          <h2 className={b('main-title')()}>TERMS OF SERVICES</h2>
          <p className={`${classPara} ${classParaBold}`}>PLEASE READ THE TERMS OF THIS AGREEMENT, INCLUDING THE TERMS &amp; CONDITIONS ATTACHED AS APPENDIX A, CAREFULLY. BY CLICKING ON AN “I AGREE” BUTTON OR CHECK BOX PRESENTED WITH THESE TERMS OR, IF EARLIER, BY ACCESSING OR USING ANY SERVICES, YOU AGREE TO BE LEGALLY BOUND BY THESE TERMS.</p>
          <p className={classPara}>This Agreement between you as an individual or corporation, as the case may be, and Trade.io Financial LTD binds you to the terms, conditions and agreements contained herein for the purposes of loaning your Trade Tokens to the Liquidity Pool.</p>
          <p className={classPara}>By clicking "Accept" you hereby irrevocably and unconditionally agree to the following terms and their definitions:</p>
          <ul>
            <li><p className={classPara}>The <b className={classParaBold}>Loan Date</b> (defined as the date you click "Accept")</p></li>
            <li><p className={classPara}>The <b className={classParaBold}>Loan Amount</b> (defined as the number of TIOx you choose to loan, and as you may amend in the future per the Terms &amp; Conditions, to the Liquidity Pool by clicking "Accept")</p></li>
            <li><p className={classPara}>The <b className={classParaBold}>Investor</b>, and as further defined the <b className={classParaBold}>Lender</b>, (defined as your legal and binding name, as an individual or corporation, as the case may be, as specified during the Account Creation, as hereinafter defined)</p></li>
            <li><p className={classPara}>The <b className={classParaBold}>Contact Information</b> (defined as the information you provided during the Account Creation)</p></li>
          </ul>
          <p className={classPara}>By clicking "Accept" you agree to be legally bound by the incorporated Loan Agreement, including the Terms &amp; Conditions, as if the legal terms were fully set forth therein and as hereinafter defined.</p>
          <address>
            trd.io<br />
            c/o Unit 2A, 2nd Floor, Landmark Square, Earth Close,<br />
            West Bay Road, PO Box 31489, Grand Cayman,<br />
            Cayman Islands, KY1-1206<br />
            www.trd.io
          </address>
          <section>
            <h4 className={b('title')()}>
              Investor<br />and<br />Trade.io Financial LTD
              <p className={b('title--border')()}>Loan Agreement</p>
            </h4>

            <p className={classPara}><b className={classParaBold}>This loan agreement</b> is made as of the Loan Date specified and by the Investor specified and previously defined.</p>
            <p className={classParaBold}>Please read the terms of this Agreement carefully. By clicking on an “I Agree” button or check box presented with these Terms or, if earlier, by accessing or using any Services, you agree to be legally bound by these Terms.</p>

            <p className={classParaBold}>BETWEEN</p>
            <p className={classPara}>trd.io <b className={classParaBold}>Investor</b>, a corporation or individual, as the case may be, with registered number and address as agreed in the Investors' trd.io account information as provided at the Account Creation (the <b className={classParaBold}>Lender</b>); and</p>
            <p className={classPara}><b className={classParaBold}>Trade.io Financial LTD</b>, a Cayman Islands Company, with registered number 338822, whose address is at c/o Unit 2A, 2nd Floor, Landmark Square. Earth Close, West Bay Road, PO Box 31489, Grand Cayman, Cayman Islands, KY1-1206 (the <b className={classParaBold}>Borrower</b>).</p>
            <p className={classParaBold}>WHEREAS</p>
            <p className={classPara}>The borrower and the lender have authorised their entry into this agreement in order for the lender to make a daily loan of trade tokens to the borrower to be determined each day at 00:00:00 GMT.</p>

            <p className={classPara}><b className={classParaBold}>It is agreed</b> as follows: </p>

            <ol className={listB()}>
              {definitionContent.map((item, index) => createListItem(item, 0, index + 1, 0))}
            </ol>
            <p className={classPara}><b className={classParaBold}>In witness</b> whereof the parties have caused this Agreement to be executed on the date first written above.</p>

            <p className={classParaBold}>LENDER</p>
            <p className={classPara}>Signed for and on behalf of <b className={classParaBold}>INVESTOR</b></p>
            <p className={classPara}>/s/ Investor</p>
            <p className={classPara}>Per agreement of the Investor this signature shall be accepted and legally binding as if personally signed.</p>
            <p className={classPara}>Signature</p>
            <p className={classPara}>As Provided at Account Creation</p>
            <p className={classPara}>Print name</p>
            <p className={classPara}>As Provided at Account Creation</p>
            <p className={classPara}>Title</p>

            <p className={classParaBold}>BORROWER</p>
            <p className={classPara}>Signed for and on behalf of <b className={classParaBold}>TRADE.IO FINANCIAL LTD</b></p>
            <p className={classPara}>/s/ Terence Tan</p>
            <p className={classPara}>Signature</p>
            <p className={classPara}>Terence Tan</p>
            <p className={classPara}>Print name</p>
            <p className={classPara}>Authorized Signatory</p>
            <p className={classPara}>Title</p>
          </section>

          <h2 className={b('title')()}>
            <p>APPENDIX A</p>
            <p className={b('main-title')()}>LIQUIDITY POOL TERMS OF SERVICES</p>
          </h2>

          <p className={classPara}>These Terms of Service and any terms expressly incorporated herein (“<b className={classParaBold}>Terms</b>”) apply to any Loan Agreement entered between you and trd.io Technologies Limited (“<b className={classParaBold}>trd.io</b>”, “<b className={classParaBold}>we</b>”, “<b className={classParaBold}>us</b>” or “<b className={classParaBold}>our</b>”) on our platform through our website https://trd.io/en or via our mobile applications (the “<b className={classParaBold}>Platform</b>”), for the purposes of loaning TIOx to the Liquidity Pool, and to any other related services provided by us (collectively, the “<b className={classParaBold}>Services</b>”). </p>
          <p className={`${classPara} ${classParaBold}`}>Please read these Terms carefully. By clicking on an “I Agree” button or check box presented with these Terms or, if earlier, by accessing or using any Services, you agree to be legally bound by these Terms.</p>
          <ol className={listB()}>
            {content.map((item, index) => createListItem(item, 0, index + 1, 0))}
          </ol>
        </article>
        <div className={b('action-bar')()}>
          <div className={b('action-bar-item')()}>
            <Checkbox
              onChange={this.handleChangeCheckbox}
              checked={this.state.checked}
            />
            <div className={b('accept-button')()}>
              <Button
                size="large"
                color="black-white"
                disabled={!this.state.checked}
                onClick={this.handleClickAccept}
              >
                Accept
              </Button>
            </div>
          </div>
          <div className={b('action-bar-item')()}>
            <Link
              className={b('nav-link')()}
              href="https://tradeiokyc.blob.core.windows.net/kyc-forms/Tradeio_LP_Loan_Agreement_and_Terms_of_Services%20.pdf"
              download="Trade.io - LP Loan Agreement and Terms of Services - October 5, 2018"
            >
              <Button size="large" color="black-white">Download PDF</Button>
            </Link>
            <NavLink to={pathToTrade} className={b('nav-link')()}>
              <Button size="large" color="black-white">Cancel</Button>
            </NavLink>
          </div>
        </div>
      </div>

    );
  }

  @bind
  private handleChangeCheckbox() {
    this.setState({ checked: !this.state.checked });
  }

  @bind
  private handleClickAccept() {
    this.props.setUseLiquidityPool(true);
  }
}

export default LPtermsOfService;
