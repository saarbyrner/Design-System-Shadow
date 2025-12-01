// @flow
import { useMemo } from 'react';
import { css } from '@emotion/react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { IconButton, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Issue } from '../../../../../shared/types';
import { getIssueTitle } from '../../../../../shared/utils';
import style from '../AddIssueSidePanelStyle';

type Props = {
  allIssues: { open_issues: Array<Issue>, closed_issues: Array<Issue> },
  isLoadingIssues: boolean,
  selectedLinkedIssues: {
    injuries: Array<number>,
    illnesses: Array<number>,
  },
  onSelectLinkedIllness: (Array<number>) => void,
  onSelectLinkedInjury: (Array<number>) => void,
  onRemove: Function,
};

function LinkedIssues(props: I18nProps<Props>) {
  const createOption = (prefix, issue) => ({
    value: `${prefix}|${issue.id}`,
    label: getIssueTitle(issue, true),
  });

  const options = useMemo(() => {
    const open = {
      label: props.t('Open Issues'),
      options: [],
    };
    const closed = {
      label: props.t('Closed Issues'),
      options: [],
    };

    const addIssueToOptions = (issues, targetOptions) => {
      issues.forEach((issue) => {
        const prefix = issue.issue_type === 'Injury' ? 'injuries' : 'illnesses';
        const option = createOption(prefix, issue);
        targetOptions.push(option);
      });
    };
    // We used to separate issues into 'open' or 'closed' categories based on
    // whether they were marked closed or not. but we need to display also injuries
    // from prior club so the closed might come as false so it will get displayed in the open array
    // Instead of adjusting that on the UI, we should respect the groups that are returned by the BE
    addIssueToOptions(props.allIssues.open_issues, open.options);
    addIssueToOptions(props.allIssues.closed_issues, closed.options);

    return [open, closed];
  }, [props.allIssues]);

  return (
    <div css={[style.section]}>
      <div
        css={[
          style.row,
          css`
            align-items: center;
            margin-bottom: 4px;

            .iconButton {
              height: 24px;
              min-width: 24px;
              padding: 0;
            }
          `,
        ]}
      >
        <h3 className="kitmanHeading--L3">
          {props.t('Attach associated issue')}
        </h3>
        <IconButton
          icon="icon-bin"
          isTransparent
          onClick={() => {
            props.onSelectLinkedInjury([]);
            props.onSelectLinkedIllness([]);
            props.onRemove();
          }}
        />
      </div>
      <Select
        value={[
          ...props.selectedLinkedIssues.illnesses.map(
            (id) => `illnesses|${id.toString()}`
          ),
          ...props.selectedLinkedIssues.injuries.map(
            (id) => `injuries|${id.toString()}`
          ),
        ]}
        onChange={(value) => {
          const { injuries, illnesses } = value.reduce(
            (acc, curr) => {
              const [type, id] = curr.split('|');
              const newObj = { ...acc };

              newObj[type].push(parseInt(id, 10));

              return newObj;
            },
            {
              injuries: [],
              illnesses: [],
            }
          );

          props.onSelectLinkedInjury(injuries);
          props.onSelectLinkedIllness(illnesses);
        }}
        isLoading={props.isLoadingIssues}
        options={options}
        isMulti
        appendToBody
      />
    </div>
  );
}

export const LinkedIssuesTranslated: ComponentType<Props> =
  withNamespaces()(LinkedIssues);
export default LinkedIssues;
