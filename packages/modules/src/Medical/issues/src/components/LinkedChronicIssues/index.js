// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { LineLoader, Select, TextButton, TextLink } from '@kitman/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { Alert, Snackbar, IconButton } from '@kitman/playbook/components';
import { rootTheme } from '@kitman/playbook/themes';
import type { ChronicIssues } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import { saveIssue } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import useViewType from '../../hooks/useViewType';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';

type RequestStatus = 'PENDING' | 'FAILURE' | null;
type Props = {
  athleteId: number,
  chronicIssues: ChronicIssues,
  isLoading: boolean,
};

const styles = {
  section: {
    backgroundColor: colors.white,
    border: `${convertPixelsToREM(1)} solid ${colors.neutral_300}`,
    borderRadius: convertPixelsToREM(3),
    padding: convertPixelsToREM(24),
    position: 'relative',
    marginBottom: convertPixelsToREM(16),
  },
  list: {
    listStyleType: 'none',
    padding: '0',
    marginBottom: '0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: convertPixelsToREM(24),
  },
  actions: {
    display: 'flex',
    button: {
      '&:not(:last-of-type)': {
        marginRight: convertPixelsToREM(5),
      },
    },
  },
  sectionLoader: {
    bottom: '0',
    height: convertPixelsToREM(4),
    left: '0',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
};

function LinkedChronicIssues(props: I18nProps<Props>) {
  const {
    isPresentationMode,
    isEditMode,
    activateEditMode,
    activatePresentationMode,
  } = useViewType();
  const { issue, updateIssue, issueType, isReadOnly } = useIssue();

  const { isIssueTabLoading, updateIssueTabRequestStatus } =
    useIssueTabRequestStatus();

  const [snackBarIsOpen, setSnackBarIsOpen] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const linkedChronicIssues = issue.linked_chronic_issues || [];
  const [selectValue, setSelectValue] = useState(
    linkedChronicIssues.map(
      (linkedChronicIssue) => linkedChronicIssue.chronic_issue.id
    )
  );

  const save = () => {
    updateIssueTabRequestStatus('PENDING');
    const linkedChronicIssuesForPayload = selectValue.map((value) => {
      return { id: value };
    });
    setRequestStatus('PENDING');
    saveIssue(issueType, issue, {
      linked_chronic_issues: linkedChronicIssuesForPayload,
      issue_contact_type_id: issue.issue_contact_type?.id || null,
      injury_mechanism_id: issue.injury_mechanism_id || null,
      presentation_type_id: issue.presentation_type?.id || null,
    })
      .then((updatedIssue) => {
        activatePresentationMode();
        setRequestStatus(null);
        updateIssue(updatedIssue);
        setSelectValue(
          updatedIssue.linked_chronic_issues.map(
            (linkedChronicIssue) => linkedChronicIssue.chronic_issue.id
          )
        );
        updateIssueTabRequestStatus('DORMANT');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        updateIssueTabRequestStatus('DORMANT');
      });
    setSnackBarIsOpen(true);
  };

  const getFormattedText = (athleteIssue: Object) => {
    return `${formatStandard({
      date: moment(athleteIssue.reported_date),
      showTime: false,
    })} - ${athleteIssue?.full_pathology}`;
  };

  const options = useMemo(() => {
    const chronicIssues = {
      label: !issue.has_recurrence
        ? props.t('Chronic conditions')
        : props.t('Chronic Issues'),
      options: [],
    };

    props.chronicIssues.forEach((athleteIssue) => {
      const option = {
        value: athleteIssue.id,
        label: getFormattedText(athleteIssue),
      };
      chronicIssues.options.push(option);
    });

    return [chronicIssues];
  }, [props.chronicIssues]);

  const selectedChronicIssues: any = useMemo(() => {
    if (props.chronicIssues.length) {
      return selectValue.map((selectedIssue) =>
        props.chronicIssues.find(
          (athleteIssue) => selectedIssue === athleteIssue.id
        )
      );
    }
    return [];
  }, [props.chronicIssues, selectValue]);

  const getSavedText = () => {
    if (isPresentationMode) {
      return linkedChronicIssues.length > 0 ? props.t('Edit') : props.t('Add');
    }
    return props.t('Save');
  };

  const getActions = () => {
    if (isReadOnly) return null;
    return (
      <>
        {isEditMode && (
          <TextButton
            type="subtle"
            text={props.t('Discard changes')}
            onClick={() => {
              setSelectValue(
                linkedChronicIssues.map(
                  (linkedChronicIssue) => linkedChronicIssue.chronic_issue.id
                )
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
              : // there is currently no 'disabled state' so keeping as is
                false
          }
          kitmanDesignSystem
        />
      </>
    );
  };

  return (
    <>
      <section style={styles.section}>
        <h2 className="kitmanHeading--L2" style={styles.header}>
          {props.t('Linked Chronic condition')}
          <div style={styles.actions}>{getActions()}</div>
        </h2>
        <ul style={styles.list}>
          {isPresentationMode &&
            !!selectedChronicIssues.length &&
            selectedChronicIssues.map((chronicIssue) => (
              <li key={chronicIssue.id}>
                <TextLink
                  text={getFormattedText(chronicIssue)}
                  href={`/medical/athletes/${props.athleteId}/chronic_issues/${chronicIssue?.id}`}
                  kitmanDesignSystem
                />
              </li>
            ))}
          {isPresentationMode && !selectedChronicIssues.length && (
            <span>{props.t('No chronic injury/illness linked.')}</span>
          )}
        </ul>
        {isEditMode && (
          <div data-testid="LinkedChronicIssues|UpdateLinkedChronicIssues">
            <Alert
              severity="info"
              sx={{
                backgroundColor: rootTheme.palette.info.lightBlue,
                marginBottom: '1rem',
              }}
            >
              {props.t(
                'Linking to chronic condition will change the injury type to chronic injury'
              )}
            </Alert>

            <Select
              isLoading={props.isLoading}
              value={selectValue}
              onChange={setSelectValue}
              options={options}
              isMulti
              appendToBody
              menuPlacement="auto"
            />
          </div>
        )}

        {requestStatus === 'PENDING' && (
          <div
            style={styles.sectionLoader}
            data-testid="LinkedChronicIssues|LineLoader"
          >
            <LineLoader />
          </div>
        )}
      </section>
      <Snackbar
        sx={{ marginBottom: '2rem' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackBarIsOpen}
        message={props.t('Chronic condition linked')}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackBarIsOpen(false)}
          >
            <KitmanIcon fontSize="small" name={KITMAN_ICON_NAMES.Close} />
          </IconButton>
        }
      />
    </>
  );
}

export const LinkedChronicIssuesTranslated: ComponentType<Props> =
  withNamespaces()(LinkedChronicIssues);
export default LinkedChronicIssues;
