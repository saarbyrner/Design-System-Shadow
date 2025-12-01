// @flow
import type { ComponentType } from 'react';
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { saveChronicIssue } from '@kitman/services';
import { TextLink, TextButton, Select, LineLoader } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import { getIssueTitle, getIssueTypePath } from '../../../../shared/utils';
import useViewType from '../../hooks/useViewType';
import type { Issue } from '../../../../shared/types';
import { useGetAthleteIssuesQuery } from '../../../../shared/redux/services/medical';

type Props = {};

const style = {
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
    margin-bottom: 16px;
  `,
  list: css`
    list-style-type: none;
    padding: 0;
    margin-bottom: 0;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  `,
  actions: css`
    display: flex;
    button {
      &:not(:last-of-type) {
        margin-right: 5px;
      }
    }
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
};

const getPrefix = (issue: Issue) =>
  issue.issue_type === 'Injury' ? 'injury' : 'illness';

const getValue = (issue: Issue) => `${getPrefix(issue)}|${issue.id}`;

function ChronicOccurrences(props: I18nProps<Props>) {
  const { issue, updateIssue, isReadOnly } = useIssue();
  const {
    isPresentationMode,
    isEditMode,
    activateEditMode,
    activatePresentationMode,
  } = useViewType();

  const { isIssueTabLoading, updateIssueTabRequestStatus } =
    useIssueTabRequestStatus();

  const { data = { issues: [] }, isLoading } = useGetAthleteIssuesQuery({
    athleteId: issue.athlete_id,
    issuesPerPage: 100,
    limitToCurrOrg: true,
  });

  // $FlowFixMe
  const chronicOccurrences = issue.occurrences.chronic_occurrences;
  const [selectValue, setSelectValue] = useState(
    chronicOccurrences.map((occurrence) => getValue(occurrence))
  );

  const options = useMemo(() => {
    const open = {
      label: props.t('Open Issues'),
      options: [],
    };
    const closed = {
      label: props.t('Closed Issues'),
      options: [],
    };

    data.issues.forEach((athleteIssue) => {
      if (athleteIssue.id === issue.id) {
        return;
      }

      const option = {
        value: getValue(athleteIssue),
        label: getIssueTitle(athleteIssue, true),
      };

      if (athleteIssue.closed) {
        closed.options.push(option);
      } else {
        open.options.push(option);
      }
    });

    return [open, closed];
  }, [data.issues]);

  const save = () => {
    updateIssueTabRequestStatus('PENDING');
    const ids = selectValue.map((value) => {
      const [type, id] = value.split('|');

      return {
        id: parseInt(id, 10),
        type,
      };
    });
    saveChronicIssue(issue.athlete_id, issue.id, {
      chronic_occurrences: ids.map(({ id, type }) => {
        return {
          id,
          issue_type: type,
        };
      }),
    }).then((updatedIssue) => {
      updateIssue(updatedIssue);
      activatePresentationMode();
      updateIssueTabRequestStatus('DORMANT');
    });
  };
  const getActionButtons = () => {
    if (isReadOnly) return null;
    return (
      <div css={style.actions}>
        {isEditMode && (
          <TextButton
            type="subtle"
            text={props.t('Discard changes')}
            onClick={() => {
              setSelectValue(
                chronicOccurrences.map((occurrence) => getValue(occurrence))
              );
              activatePresentationMode();
            }}
            kitmanDesignSystem
          />
        )}
        <TextButton
          type="secondary"
          text={
            isPresentationMode ? props.t('Add occurrence') : props.t('Save')
          }
          onClick={() => {
            if (isPresentationMode) {
              activateEditMode();
            } else {
              save();
            }
          }}
          isDisabled={
            window.featureFlags['disable-parallel-injury-edits']
              ? isIssueTabLoading
              : // there is currently no "disabled state" so keeping it that way
                false
          }
          kitmanDesignSystem
        />
      </div>
    );
  };
  return (
    <section css={style.section} data-testid="ChronicOccurences">
      <h2 className="kitmanHeading--L2" css={style.header}>
        {props.t('Occurrence History')}

        {getActionButtons()}
      </h2>
      <ul css={style.list}>
        {isPresentationMode &&
          chronicOccurrences.map((chronicOccurrence) => (
            <li key={chronicOccurrence.id}>
              <TextLink
                text={getIssueTitle(chronicOccurrence, true)}
                href={`/medical/athletes/${issue.athlete_id}/${getIssueTypePath(
                  chronicOccurrence.issue_type
                )}/${chronicOccurrence.id}`}
                kitmanDesignSystem
              />
            </li>
          ))}
      </ul>
      {isEditMode && (
        <div data-testid="ChronicOccurrences|UpdateChronicOccurrences">
          <Select
            value={selectValue}
            onChange={setSelectValue}
            isLoading={isLoading}
            isDisabled={isLoading}
            options={options}
            isMulti
            appendToBody
            label={props.t('Select Occurence(s)')}
          />
        </div>
      )}

      {isLoading && (
        <div
          css={style.sectionLoader}
          data-testid="ChronicOccurrences|LineLoader"
        >
          <LineLoader />
        </div>
      )}
    </section>
  );
}

export const ChronicOccurrencesTranslated: ComponentType<Props> =
  withNamespaces()(ChronicOccurrences);
export default ChronicOccurrences;
