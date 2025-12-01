// @flow
import moment from 'moment';
import _uniqueId from 'lodash/uniqueId';

import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Link,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@kitman/playbook/components';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { EventDeletionPromptResponse } from '@kitman/services/src/services/planning/getEventDeletionPrompt';
import colors from '@kitman/common/src/variables/colors';
import i18n from '@kitman/common/src/utils/i18n';
import { createPlanningEventUrl } from '@kitman/modules/src/CalendarPage/src/components/EventTooltip/utils/helpers';
import type { CreatableEventType } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';

export const formatDate = (date: string) =>
  formatStandard({
    date: moment(date),
    showTime: true,
    showCompleteDate: false,
    displayLongDate: false,
  });

const EventDeletionPrompt = ({
  isLoading,
  eventDeletionAttributes,
  eventType,
}: {
  isLoading: boolean,
  eventDeletionAttributes: EventDeletionPromptResponse,
  eventType: CreatableEventType,
}) => {
  const renderTable = ({
    rows,
    headerText,
    footerText,
    chipText,
  }: {
    rows: Array<
      Array<{ key: string | number, text: string, href: string | null }>
    >,
    chipText: number,
    headerText: string,
    footerText: string,
  }) => (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Chip color="primary" label={chipText} size="small" />
          <Typography variant="body2">{headerText}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table>
            <TableBody sx={{ borderTop: '1px solid #ddd' }}>
              {rows.map((row) => (
                <TableRow key={_uniqueId('delete_prompt_row_')}>
                  {row.map((cell, index) => (
                    <TableCell
                      sx={{ width: index === 0 ? '35%' : '65%' }}
                      key={cell.key}
                    >
                      {cell.href ? (
                        <Link
                          href={cell.href}
                          underline="hover"
                          target="_blank"
                          sx={{
                            '&:visited': { color: colors.grey_200 },
                            '&:hover': { color: colors.grey_200 },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {cell.text}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography variant="body2">{cell.text}</Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="body2" sx={{ fontSize: '12px' }}>
                    {footerText}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '24px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const constructEventName = (detailedEvent) =>
    detailedEvent.name ??
    detailedEvent.session_type?.name ??
    // $FlowIgnore[incompatible-type] due to validations this won't be undefined
    `${detailedEvent.opponent_team?.name} - ${detailedEvent.competition?.name}`;

  const constructEventLink = (eventId, hash) =>
    createPlanningEventUrl({
      id: eventId,
      start: null,
      url: `/planning_hub/events/${eventId}`,
      hash,
      extendedProps: { type: eventType },
      openEventSwitcherSidePanel: false,
    });

  return (
    <Box sx={{ margin: '8px 0px' }}>
      {eventDeletionAttributes?.issues?.length > 0 &&
        renderTable({
          rows: eventDeletionAttributes.issues.flatMap((linkedIssue) =>
            linkedIssue.detailed_issues.map((detailedIssue) => {
              const issueType =
                detailedIssue.issue_type === 'Injury'
                  ? 'injuries'
                  : 'illnesses';
              return [
                {
                  key: _uniqueId('delete_prompt_cell_'),
                  text: `${constructEventName(
                    linkedIssue.detailed_event
                  )} - ${formatDate(linkedIssue.detailed_event.start_date)}`,
                  href: constructEventLink(linkedIssue.detailed_event.id),
                },
                {
                  key: _uniqueId('delete_prompt_cell_'),
                  text: linkedIssue.permission_granted
                    ? `${detailedIssue.athlete_fullname} - ${formatDate(
                        detailedIssue.occurrence_date
                      )} - ${detailedIssue.full_pathology}`
                    : i18n.t('No permission. Contact Admin.'),
                  href: linkedIssue.permission_granted
                    ? `/medical/athletes/${detailedIssue.athlete_id}/${issueType}/${detailedIssue.id}`
                    : null,
                },
              ];
            })
          ),
          chipText: eventDeletionAttributes.issues.flatMap(
            (issues) => issues.detailed_issues
          ).length,
          headerText: i18n.t(
            'Medical record(s) must be unlinked in order to proceed with event deletion'
          ),
          footerText: i18n.t(
            'Please re-link the injury/illness to an appropriate event.'
          ),
        })}

      {eventDeletionAttributes?.imported_data?.length > 0 &&
        renderTable({
          rows: eventDeletionAttributes.imported_data.flatMap((linkedData) =>
            linkedData.detailed_imports.map((detailedImport) => [
              {
                key: _uniqueId('delete_prompt_cell_'),
                text: `${constructEventName(
                  linkedData.detailed_event
                )} - ${formatDate(linkedData.detailed_event.start_date)}`,
                href: constructEventLink(linkedData.detailed_event.id),
              },
              {
                key: _uniqueId('delete_prompt_cell_'),
                text: detailedImport.name,
                href: constructEventLink(
                  linkedData.detailed_event.id,
                  'imported_data'
                ),
              },
            ])
          ),
          chipText: eventDeletionAttributes.imported_data.flatMap(
            (linkedData) => linkedData.detailed_imports
          ).length,
          headerText: i18n.t('CSV/API data import(s) will be deleted'),
          footerText: i18n.t(
            'Please re-import the data to the appropriate event.'
          ),
        })}

      {eventDeletionAttributes?.assessments?.length > 0 &&
        renderTable({
          rows: eventDeletionAttributes.assessments.flatMap(
            (linkedAssessment) =>
              linkedAssessment.detailed_assessments.map(
                (detailedAssessment) => [
                  {
                    key: _uniqueId('delete_prompt_cell_'),
                    text: `${constructEventName(
                      linkedAssessment.detailed_event
                    )} - ${formatDate(
                      linkedAssessment.detailed_event.start_date
                    )}`,
                    href: constructEventLink(
                      linkedAssessment.detailed_event.id
                    ),
                  },
                  {
                    key: _uniqueId('delete_prompt_cell_'),
                    text: linkedAssessment.permission_granted
                      ? detailedAssessment.name
                      : i18n.t('No permission. Contact Admin.'),
                    href: linkedAssessment.permission_granted
                      ? constructEventLink(
                          linkedAssessment.detailed_event.id,
                          'collection'
                        )
                      : null,
                  },
                ]
              )
          ),
          chipText: eventDeletionAttributes.assessments.flatMap(
            (linkedAssessment) => linkedAssessment.detailed_assessments
          ).length,
          headerText: i18n.t('Assessment(s) will be unlinked'),
          footerText: i18n.t(
            'Please re-link the assessments to an appropriate event.'
          ),
        })}
    </Box>
  );
};

export default EventDeletionPrompt;
