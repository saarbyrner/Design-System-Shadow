// @flow
import type { ComponentType } from 'react';
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { colors } from '@kitman/common/src/variables';
import { LineLoader, Select, TextButton, TextLink } from '@kitman/components';
import { saveIssue } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Issue } from '../../../../shared/types';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { getIssueTitle, getIssueTypePath } from '../../../../shared/utils';
import useViewType from '../../hooks/useViewType';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';

type RequestStatus = 'PENDING' | 'FAILURE' | null;
type Props = {
  allAthleteIssues: { open_issues: Array<Issue>, closed_issues: Array<Issue> },
  isLoadingIssues: boolean,
};

const styles = {
  section: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: convertPixelsToREM(3),
    padding: convertPixelsToREM(24),
    position: 'relative',
    marginBottom: convertPixelsToREM(16),
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: convertPixelsToREM(24),
  },
  actions: {
    display: 'flex',
    button: {
      marginRight: convertPixelsToREM(5),
    },
  },
  sectionLoader: {
    bottom: 0,
    height: convertPixelsToREM(4),
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
};

const getPrefix = (issue: Issue) =>
  issue.issue_type === 'Injury' ? 'injuries' : 'illnesses';

const getValue = (issue: Issue) => `${getPrefix(issue)}|${issue.id}`;

function LinkedIssues(props: I18nProps<Props>) {
  const {
    isPresentationMode,
    isEditMode,
    activateEditMode,
    activatePresentationMode,
  } = useViewType();
  const { issue, updateIssue, issueType, isReadOnly } = useIssue();
  const { isIssueTabLoading, updateIssueTabRequestStatus } =
    useIssueTabRequestStatus();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const linkedIssues = issue.linked_issues ? issue.linked_issues : [];
  const [selectValue, setSelectValue] = useState(
    linkedIssues
      .filter((linkedIssue) => linkedIssue !== null)
      .map((linkedIssue) => getValue(linkedIssue))
  );

  const save = () => {
    const { injuries, illnesses } = selectValue.reduce(
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

    updateIssueTabRequestStatus('PENDING');
    setRequestStatus('PENDING');
    saveIssue(issueType, issue, {
      linked_issues: {
        injuries,
        illnesses,
      },
      issue_contact_type_id: issue.issue_contact_type?.id || null,
      injury_mechanism_id: issue.injury_mechanism_id || null,
      presentation_type_id: issue.presentation_type?.id || null,
    })
      .then((updatedIssue) => {
        activatePresentationMode();
        setRequestStatus(null);
        updateIssue(updatedIssue);
        setSelectValue(
          updatedIssue.linkedIssues.map((linkedIssue) => getValue(linkedIssue))
        );
        updateIssueTabRequestStatus('DORMANT');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        updateIssueTabRequestStatus('DORMANT');
      });
  };

  const createOption = (prefix, athleteIssue) => ({
    value: `${prefix}|${athleteIssue.id}`,
    label: getIssueTitle(athleteIssue, true),
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

    const addIssueToOptions = (athleteIssues, targetOptions) => {
      athleteIssues.forEach((athleteIssue) => {
        const prefix =
          athleteIssue.issue_type === 'Injury' ? 'injuries' : 'illnesses';
        const option = createOption(prefix, athleteIssue);
        targetOptions.push(option);
      });
    };

    // We used to separate issues into 'open' or 'closed' categories based on
    // whether they were marked closed or not. but we need to display also injuries
    // from prior club so the closed might come as false so it will get displayed in the open array
    // Instead of adjusting that on the UI, we should respect the groups that are returned by the BE
    addIssueToOptions(props.allAthleteIssues.open_issues, open.options);
    addIssueToOptions(props.allAthleteIssues.closed_issues, closed.options);

    return [open, closed];
  }, [props.allAthleteIssues]);

  const getSavedText = () => {
    if (isPresentationMode) {
      return linkedIssues.length > 0 ? props.t('Edit') : props.t('Add');
    }

    return props.t('Save');
  };

  const renderActions = () => {
    if (isReadOnly) return <></>;
    return (
      <>
        {isEditMode && (
          <TextButton
            type="subtle"
            text={props.t('Discard changes')}
            onClick={() => {
              setSelectValue(
                linkedIssues
                  .filter((linkedIssue) => linkedIssue !== null)
                  .map((linkedIssue) => getValue(linkedIssue))
              );
              activatePresentationMode();
            }}
            kitmanDesignSystem
          />
        )}
        <TextButton
          type="secondary"
          text={getSavedText()}
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
              : // currently no 'disable state'
                false
          }
          kitmanDesignSystem
        />
      </>
    );
  };
  return (
    <section css={styles.section}>
      <h2 className="kitmanHeading--L2" css={styles.header}>
        {props.t('Associated issues')}

        <div css={styles.actions}>{renderActions()}</div>
      </h2>
      <ul css={styles.list}>
        {isPresentationMode &&
          linkedIssues
            .filter((linkedIssue) => linkedIssue !== null)
            .map((linkedIssue) => (
              <li key={linkedIssue.id}>
                <TextLink
                  text={getIssueTitle(linkedIssue, true)}
                  href={`/medical/athletes/${
                    issue.athlete_id
                  }/${getIssueTypePath(linkedIssue.issue_type)}/${
                    linkedIssue.id
                  }`}
                  kitmanDesignSystem
                />
              </li>
            ))}
      </ul>
      {isEditMode && (
        <div data-testid="LinkedIssues|UpdateLinkedIssues">
          <Select
            value={selectValue}
            onChange={setSelectValue}
            isLoading={props.isLoadingIssues}
            options={options}
            isMulti
            appendToBody
          />
        </div>
      )}

      {requestStatus === 'PENDING' && (
        <div css={styles.sectionLoader} data-testid="LinkedIssues|LineLoader">
          <LineLoader />
        </div>
      )}
    </section>
  );
}

export const LinkedIssuesTranslated: ComponentType<Props> =
  withNamespaces()(LinkedIssues);
export default LinkedIssues;
