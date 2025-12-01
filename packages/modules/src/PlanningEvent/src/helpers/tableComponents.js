// @flow

import uuid from 'uuid';
import { css } from '@emotion/react';

import type { Translation } from '@kitman/common/src/types/i18n';
import {
  TextHeader,
  TextCell,
} from '@kitman/modules/src/Medical/shared/components/MedicalDocumentsTab/components/DocumentsTableCells';

export const createHeaderFunction =
  (t: Translation, headerText: string) => () =>
    <TextHeader key={uuid()} value={t(headerText)} />;

export const mapArrayToCells = (arr: string[]) => {
  const textCells = arr.map((str) => <TextCell key={uuid()} value={str} />);
  return <div>{textCells}</div>;
};

export const getTableStyles = (tableRef: {|
  current: ?React$ElementRef<string>,
|}) => {
  // $FlowFixMe .getBoundingClientRect().y is a valid property
  const y = tableRef.current?.getBoundingClientRect().y;
  const dataTableStyle = {
    Table: css`
      height: calc(100vh - ${y}px - 20px);
      word-break: break-all;
      overflow-y: scroll;
    `,
    TableEmpty: css`
      height: auto;
    `,
  };
  return dataTableStyle;
};

export default {};
