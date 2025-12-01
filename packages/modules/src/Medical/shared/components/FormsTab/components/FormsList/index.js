// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import i18n from '@kitman/common/src/utils/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import UserAvatar from '@kitman/components/src/UserAvatar';
import { ReactDataGrid, TextLink } from '@kitman/components';
import type { ColumnCellDataType } from '@kitman/modules/src/Medical/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormSummary } from '@kitman/modules/src/Medical/shared/types/medical/FormSummary';

import style from './style';

type Props = {
  isLoading: boolean,
  showAvatar?: boolean,
  showAthleteInformation?: boolean,
  forms: Array<FormSummary>,
  athleteId: ?number,
};

const FormsList = (props: I18nProps<Props>) => {
  const loadingStyle = {
    formsList: {
      overflowY: 'auto',
    },
    formsListEmpty: {
      height: 'auto',
    },
  };

  const dateFormatter = (columnCellData: ColumnCellDataType) => {
    const dateValue = DateFormatter.formatStandard({
      date: moment(
        columnCellData.row.completionDate,
        DateFormatter.dateTransferFormat
      ),
      displayLongDate: true,
    });

    return <div>{dateValue}</div>;
  };

  const formTypeFormatter = (columnCellData: ColumnCellDataType) => {
    const athleteId = columnCellData.row.athlete
      ? columnCellData.row.athlete.id
      : props.athleteId;

    if (athleteId != null) {
      return (
        <TextLink
          text={columnCellData.row.formType}
          href={`/medical/athletes/${athleteId}/forms/${columnCellData.row.id}`}
        />
      );
    }
    return <>{columnCellData.row.formType}</>;
  };

  const athleteFormatter = (columnCellData: ColumnCellDataType) => {
    const athleteData = columnCellData.row.athlete;

    return (
      <div css={style.athleteCell}>
        <div css={style.imageContainer}>
          <UserAvatar
            url={athleteData.avatar_url}
            firstname={athleteData.firstname}
            lastname={athleteData.lastname}
            displayInitialsAsFallback={false}
            size="EXTRA_SMALL"
            availability={athleteData.availability}
            statusDotMargin={4}
          />
          <div css={style.detailsContainer}>
            <TextLink
              text={athleteData.fullname}
              href={`/medical/athletes/${athleteData.id}`}
            />
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      key: 'formType',
      name: i18n.t('Form Type'),
      formatter: formTypeFormatter,
    },
    {
      key: 'completionDate',
      name: i18n.t('Completion Date'),
      formatter: dateFormatter,
    },

    {
      key: 'editorFullName',
      name: i18n.t('Examiner'),
    },
  ];

  if (props.athleteId === undefined) {
    columns.unshift({
      key: 'Athlete',
      name: i18n.t('Athlete'),
      formatter: athleteFormatter,
    });
  }

  const renderTable = () => {
    const rowHeight = 40;
    return (
      <div>
        {!props.isLoading && props.forms.length > 0 && (
          <ReactDataGrid
            tableHeaderData={columns}
            tableBodyData={props.forms}
            rowHeight={rowHeight}
            tableGrow
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div
        id="formsList"
        css={
          props.forms.length
            ? loadingStyle.formsList
            : loadingStyle.formsListEmpty
        }
      >
        <div css={style.formsTable}>{renderTable()}</div>
      </div>
    </>
  );
};

export const FormsListTranslated: ComponentType<Props> =
  withNamespaces()(FormsList);
export default FormsList;
