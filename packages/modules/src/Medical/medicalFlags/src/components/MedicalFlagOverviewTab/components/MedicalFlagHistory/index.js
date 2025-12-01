// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { Accordion } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagHistory/styles';
import { VersionTranslated as Version } from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagHistory/components/Version';

type MedicalFlagVersionHistory = {
  changeset: {
    diagnosed_on?: Array<string>,
    ever_been_hospitalised?: Array<boolean>,
    require_epinephrine?: Array<boolean>,
    severity?: Array<string>,
    symptoms?: Array<string>,
    title?: Array<string>,
    visibility?: Array<string>,
  },
  updated_at: string,
  updated_by?: {
    firstname: string,
    fullname: string,
    id: number,
    lastname: string,
  },
};

type Props = {
  history: Array<MedicalFlagVersionHistory>,
};

const MedicalFlagHistory = (props: I18nProps<Props>) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // TODO: Temp until the empty changesets are understood
  const filteredEmptyChangsets: Array<MedicalFlagVersionHistory> =
    props.history.filter((v) => Object.keys(v.changeset).length > 0);

  const getTitle = () => {
    return isHistoryOpen
      ? props.t('Hide edits')
      : props.t('{{count}} {{edit}} since creation', {
          count: filteredEmptyChangsets.length,
          edit: filteredEmptyChangsets.length > 1 ? 'edits' : 'edit',
        });
  };

  return (
    <div css={style.editHistory} data-testid="EditHistory|root">
      <Accordion
        iconAlign="left"
        onChange={() =>
          setIsHistoryOpen((prevIsHistoryOpen) => !prevIsHistoryOpen)
        }
        title={
          <div css={style.historyTitle} data-testid="EditHistory|title">
            {getTitle()}
          </div>
        }
        content={filteredEmptyChangsets.map((version, index) => {
          return (
            <Version
              version={version}
              versionNumber={filteredEmptyChangsets.length - index}
              key={`${version.updated_at}_${index + 1}`}
            />
          );
        })}
        isOpen={isHistoryOpen}
      />
    </div>
  );
};

export const MedicalFlagHistoryTranslated: ComponentType<Props> =
  withNamespaces()(MedicalFlagHistory);
export default MedicalFlagHistory;
