// @flow
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import Table from '../Table';

type Props = {
  reload: Function,
  cancel: Function,
  numRows: number,
  isLoading: boolean,
  hasErrored: boolean,
};

type HeaderProps = {
  isShimmering?: boolean,
};

const Header = ({ isShimmering }: HeaderProps) => (
  <>
    <Table.Row className="tableWidget__sessionOrDateRow">
      <Table.Cell />
    </Table.Row>
    <Table.Row className="tableWidget__columnHeader">
      <Table.Cell>
        <div
          className={classnames('tableWidget__loadingColumnIndicator', {
            'tableWidget__loadingColumnIndicator--shimmering': isShimmering,
          })}
        />
      </Table.Cell>
    </Table.Row>
  </>
);

function DuplicatingStatus(props: I18nProps<Props>) {
  if (props.isLoading) {
    return (
      <Table.Column
        data-testid="DuplicatingStatus|LoadingColumn"
        className="tableWidget__column tableWidget__loadingColumn"
      >
        <Header isShimmering />
      </Table.Column>
    );
  }

  if (props.hasErrored) {
    return (
      <Table.Column
        data-testid="DuplicatingStatus|Error"
        className="tableWidget__column"
      >
        <Header />
        <Table.Row className="tableWidget__errorColumn">
          <Table.Cell style={{ height: props.numRows * 55 }}>
            <div className="tableWidget__errorColumn--content">
              <i className="tableWidget__errorColumn--icon icon-error" />
              <span className="tableWidget__errorColumn--message">
                {props.t('Unexpected Error')}
              </span>
              <span
                data-testid="DuplicatingStatus|Reload"
                className="tableWidget__errorColumn--reload"
                onClick={props.reload}
              >
                {props.t('Reload')}
              </span>
              <span
                data-testid="DuplicatingStatus|Cancel"
                className="tableWidget__errorColumn--reload"
                onClick={props.cancel}
              >
                {props.t('Cancel')}
              </span>
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Column>
    );
  }

  return null;
}

export const DuplicatingStatusTranslated = withNamespaces()(DuplicatingStatus);
export default DuplicatingStatus;
