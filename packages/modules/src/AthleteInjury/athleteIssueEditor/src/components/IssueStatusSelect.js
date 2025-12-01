// @flow
import { withNamespaces } from 'react-i18next';
import { Dropdown } from '@kitman/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { IssueStatusOption } from '../../../types/_common';

type Props = {
  injuryStatusOptions: Array<IssueStatusOption>,
  injuryStatusEventId: string,
  value: string,
  onChange: (string, string) => void,
  disabled: boolean,
  name?: string,
};

const IssueStatusSelect = (props: I18nProps<Props>) => {
  const buildDropdownOptions = () => {
    if (!props.injuryStatusOptions) {
      return [
        {
          id: '',
          title: '',
        },
      ];
    }
    return props.injuryStatusOptions.map((statusOption) => {
      const dropdownOption = {
        id: statusOption.id,
        title: statusOption.title,
      };
      return dropdownOption;
    });
  };

  return (
    <div>
      <div
        className="js-issueStatusSelect js-validationSection formValidator__section"
        data-injurystatuseventid={props.injuryStatusEventId}
        data-testid="issue-status-select"
      >
        <Dropdown
          items={buildDropdownOptions()}
          value={props.value}
          onChange={(optionId) =>
            props.onChange(optionId, props.injuryStatusEventId)
          }
          disabled={props.disabled}
          name={props.name}
        />
        <span className="formValidator__errorMsg">
          {props.t('This status is identical to the previous status')}
        </span>
      </div>
    </div>
  );
};

export const IssueStatusSelectTranslated = withNamespaces()(IssueStatusSelect);
export default IssueStatusSelect;
