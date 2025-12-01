// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useEffect, useRef, useState } from 'react';
import _isEqual from 'lodash/isEqual';
import _omit from 'lodash/omit';

import { Select } from '@kitman/components';
import { getAthleteChronicIssues, getAthleteIssues } from '@kitman/services';
import { type Option } from '@kitman/components/src/Select';
import { type Issue } from '@kitman/modules/src/Medical/shared/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type GridRow } from '@kitman/modules/src/PlanningEvent/types';
import { CircularProgress } from '@kitman/playbook/components';

type Props = {
  updateAttribute: Function,
  rowData: GridRow,
  participationLevelReasons: Array<Option>,
  disabledRows: Array<?number>,
};

type IssueWithTitle = {
  ...Issue,
  title?: string,
};

const ParticipationLevelReason = (props: I18nProps<Props>) => {
  const hasAssociatedInjuryOrIllness =
    Boolean(props.rowData.athlete?.issues) &&
    props.rowData.athlete.issues.length > 0 &&
    window.getFlag('link-multi-injuries-to-participation-level');

  const [localParticipationReason, setLocalParticipationReason] = useState(
    props.rowData
  );
  const [issuesWithTitles, setIssuesWithTitles] = useState<
    Array<IssueWithTitle>
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoading || isLoaded || !hasAssociatedInjuryOrIllness) return;
    setIsLoading(true);
  }, []);

  const abortController = useRef({
    open: { current: null },
    closed: { current: null },
    archived: { current: null },
    chronic: { current: null },
  });
  useEffect(() => {
    if (!(hasAssociatedInjuryOrIllness && isLoading) || isLoaded)
      return () => {};

    (async () => {
      const athleteId = props.rowData.athlete.id;
      let allIssuesWithTitles = [];
      try {
        allIssuesWithTitles = await Promise.all([
          // $FlowIgnore[incompatible-call]
          getAthleteIssues({
            athleteId,
            issueStatus: 'open',
            issuesPerPage: 100,
            abortController: abortController.current.open,
          }),
          getAthleteIssues({
            athleteId,
            issueStatus: 'closed',
            issuesPerPage: 100,
            abortController: abortController.current.closed,
          }),
          getAthleteIssues({
            athleteId,
            issueStatus: 'archived',
            issuesPerPage: 100,
            abortController: abortController.current.archived,
          }),
          getAthleteChronicIssues({
            athleteId,
            groupedResponse: true,
            abortController: abortController.current.chronic,
          }),
        ]);
      } catch {
        // If an error happens, do nothing. This effect just adds custom titles
        // enhancing illness/injury labels — if it fails, they will fallback to
        // the default titles.
        return;
      }

      const [open, closed, archived, chronic] = allIssuesWithTitles;
      setIssuesWithTitles(
        props.rowData.athlete.issues.map((issue) => ({
          ...issue,
          // Add a title to the issue.
          ...[
            ...[open, closed, archived].flatMap(({ issues }) => issues),
            ...Object.values(chronic).flatMap((issues) => issues),
            // $FlowIgnore[incompatible-use]
          ].find(({ id }) => id === issue.id),
        }))
      );

      setIsLoading(false);
      setIsLoaded(true);
    })();

    return () => {
      // $FlowIgnore[incompatible-use]
      Object.values(abortController.current).forEach(({ current }) =>
        current?.()
      );
    };
  }, [isLoading, isLoaded, hasAssociatedInjuryOrIllness, props.rowData]);

  const getIssueTitle = (issue: IssueWithTitle): string => {
    const issueWithTitle = issuesWithTitles.find(({ id }) => id === issue.id);
    return (
      issueWithTitle?.title ?? issueWithTitle?.issue_occurrence_title ?? ''
    );
  };

  const mapInjuryLabels = (parentId) =>
    props.rowData.athlete.issues?.map((issue) => {
      let label =
        issue.code && issue.pathology
          ? issue.pathology
          : props.t('Preliminary Injury');

      if (issue.chronic) label = `${props.t('Chronic')} | ${label}`;

      const title = getIssueTitle(issue);
      if (title) label = title;

      return {
        ...issue,
        parentId,
        value: `${issue.id}_${issue.type}`,
        label,
      };
    });

  const reasonsWithSubmenu = props.participationLevelReasons.map(
    ({ id, value, label }) =>
      value === 1
        ? {
            id,
            value,
            label,
            options: mapInjuryLabels(id),
          }
        : {
            id,
            value,
            label,
          }
  );

  const handleReasonChangeMultiSelect = (reasons): void => {
    const isMultiSelect = reasons[0]?.parentId;
    setLocalParticipationReason({
      participation_level_reason: isMultiSelect ? 1 : reasons[0]?.value || null,
      related_issues: isMultiSelect ? reasons : null,
    });
    if (reasons.length > 0 && !isMultiSelect) {
      const updateAttributes = {
        participation_level_reason: reasons[0]?.value,
        related_issues: null,
      };
      props.updateAttribute(updateAttributes, props.rowData);
    }
  };

  const handleReasonChange = (id: string | number): void => {
    const isIssueReason = typeof id === 'string';
    const participationLevelReason = isIssueReason ? 1 : id;

    const [issueId = null, issueType = null] = isIssueReason
      ? // isIssueReason check guarantees `id` is a string.
        // $FlowIgnore[prop-missing]
        id?.split('_') ?? []
      : [];

    props.updateAttribute(
      {
        participation_level_reason: participationLevelReason,
        related_issue_id: Number(issueId),
        related_issue_type: issueType,
      },
      props.rowData
    );
  };

  const showValue = () => {
    if (!window.getFlag('link-multi-injuries-to-participation-level')) {
      return props.rowData.related_issue?.id
        ? `${props.rowData.related_issue.id}_${props.rowData.related_issue.type}`
        : props.rowData.participation_level_reason;
    }

    const validRelatedIssues = localParticipationReason.related_issues?.filter(
      (relatedIssue) => relatedIssue?.id
    );

    // If we have valid related issues we display each of the selected injuries/illnesses
    if (validRelatedIssues && validRelatedIssues.length > 0) {
      return validRelatedIssues.map((relatedIssue) => {
        let label =
          relatedIssue?.code && relatedIssue.pathology
            ? relatedIssue.pathology
            : props.t('Preliminary Injury');

        const title = getIssueTitle(relatedIssue);
        if (title) label = title;

        return {
          ...relatedIssue,
          parentId: localParticipationReason.participation_level_reason,
          label,
          value: `${relatedIssue.id}_${relatedIssue.type}`,
        };
      });
    }

    return localParticipationReason.participation_level_reason
      ? [
          {
            label: props.participationLevelReasons.find(
              ({ id }) =>
                id === localParticipationReason.participation_level_reason
            )?.label,
            value: localParticipationReason.participation_level_reason,
          },
        ]
      : [];
  };

  return window.getFlag('link-multi-injuries-to-participation-level') ? (
    <Select
      options={isLoading ? [] : reasonsWithSubmenu}
      onChange={handleReasonChangeMultiSelect}
      onMenuClose={() => {
        // onMenuClose is used to send multi select values when a user has clicked off the sub-menu
        const newRelatedIssues =
          localParticipationReason.related_issues?.map((related) => {
            // omit extra values we have added
            return _omit(related, ['parentId', 'value', 'label']);
          }) || null;

        if (_isEqual(newRelatedIssues, props.rowData.related_issues)) {
          return;
        }

        const updateAttributes = {
          participation_level_reason:
            localParticipationReason.participation_level_reason,
          related_issues:
            localParticipationReason.related_issues?.map(({ value }) => {
              const [id, type] = value.split('_');
              return {
                related_issue_id: id,
                related_issue_type: type,
              };
            }) || [],
        };
        props.updateAttribute(updateAttributes, props.rowData);
      }}
      value={showValue()}
      valueContainerContent={
        isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} thickness={5} />
            <span>{props.t('Loading')}</span>
          </div>
        ) : null
      }
      onMenuOpen={() => {
        if (isLoading || isLoaded || !hasAssociatedInjuryOrIllness) return;
        setIsLoading(true);
      }}
      placeholder={
        isLoading ? props.t('Loading') : props.t('Participation Level Reason')
      }
      isDisabled={props.disabledRows.includes(props.rowData.id)}
      isLoading={isLoading}
      groupBy="submenu"
      multiSelectSubMenu
      returnParentInValueFromSubMenu
      appendToBody
      data-testid="ParticipationLevelReason|MultiSelector"
    />
  ) : (
    <Select
      options={reasonsWithSubmenu}
      onChange={handleReasonChange}
      value={showValue()}
      placeholder={props.t('Participation Level Reason')}
      isDisabled={props.disabledRows.includes(props.rowData.id)}
      groupBy="submenu"
      appendToBody
      data-testid="ParticipationLevelReason|Selector"
    />
  );
};

export const ParticipationLevelReasonTranslated: ComponentType<Props> =
  withNamespaces()(ParticipationLevelReason);

export default ParticipationLevelReason;
