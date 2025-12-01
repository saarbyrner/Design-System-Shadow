// @flow
import { useMemo } from 'react';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TooltipMenu } from '@kitman/components';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import NoteCardLayout from '../NoteCardLayout';

import Athlete from '../NoteCardLayout/components/Athlete';
import { NoteTranslated as Note } from '../NoteCardLayout/components/Note';
import { LinkedIssuesTranslated as LinkedIssues } from '../NoteCardLayout/components/LinkedIssues';
import { MetaDataTranslated as MetaDataView } from '../NoteCardLayout/components/MetaData';
import { AttachmentsTranslated as Attachments } from '../NoteCardLayout/components/Attachments';

type Props = {
  isLoading?: boolean,
  withAvatar?: boolean,
  hasActions?: boolean,
  modification: MedicalNote,
  deactivateModification: Function,
};

const style = {
  actionButton: css`
    background: transparent;
    border: 0;
    color: ${colors.grey_200};
    outline: none;
  `,

  author: css`
    margin-bottom: 16px;
    font-size: 11px;
    color: ${colors.grey_200};
    margin-top: ${'16px'};
  `,
};

const ModificationNoteCard = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();

  const tooltipItems = [
    {
      id: 1,
      description: props.t('Deactivate'),
      onClick: () => props.deactivateModification(props.modification.id),
      isVisible: permissions.medical.modifications.canEdit,
    },
  ]
    .filter((i) => i.isVisible)
    .map((i) => {
      return {
        id: i.id,
        description: i.description,
        onClick: i.onClick,
      };
    });

  const linkedIssues = [
    ...props.modification.illness_occurrences,
    ...props.modification.injury_occurrences,
  ];
  // Keeping `chronicIssues` in a separate variable and prop because it follows a different object schema.
  const chronicIssues = props.modification.chronic_issues || [];

  const getVisibility = () => {
    if (props.modification.restricted_to_doc) return props.t('Doctors');
    if (props.modification.restricted_to_psych) return props.t('Psych Team');
    return props.t('Default');
  };

  const metaData = useMemo(() => [
    {
      text: props.t('Visibility'),
      value: getVisibility(),
    },
    {
      text: props.t('Roster'),
      value: props.modification.squad?.name,
    },
  ]);

  return (
    <NoteCardLayout
      withBorder
      isLoading={props.isLoading}
      id={props.modification.id}
    >
      <NoteCardLayout.LeftContent>
        {props.withAvatar && (
          <Athlete
            avatarUrl={props.modification.annotationable.avatar_url}
            fullname={props.modification.annotationable.fullname}
            annotationableId={props.modification.annotationable.id}
          />
        )}
        <Note note={props.modification} />
      </NoteCardLayout.LeftContent>

      <NoteCardLayout.RightContent>
        {props.hasActions && tooltipItems.length > 0 && (
          <NoteCardLayout.Actions>
            <TooltipMenu
              placement="bottom-start"
              offset={[0, 0]}
              menuItems={tooltipItems}
              tooltipTriggerElement={
                <button css={style.actionButton} type="button">
                  <i className="icon-more" />
                </button>
              }
              disabled={props.isLoading}
              kitmanDesignSystem
            />
          </NoteCardLayout.Actions>
        )}

        {(linkedIssues.length > 0 || chronicIssues.length > 0) &&
          permissions.medical.issues.canView && (
            <div data-testid="ModificationNoteCard|LinkedIssues">
              <LinkedIssues
                issues={linkedIssues}
                chronicIssues={chronicIssues}
                annotationableId={props.modification.annotationable.id}
              />
            </div>
          )}

        {props.modification.attachments.length > 0 && (
          // $FlowFixMe
          <Attachments attachments={props.modification.attachments} />
        )}

        {metaData.length > 0 && <MetaDataView metaData={metaData} />}

        <div css={style.author} data-testid="MetaData|AuthorDetails">
          {props.t('Created {{date}} by {{author}}', {
            date: DateFormatter.formatStandard({
              date: moment(props.modification.created_at),
            }),
            author: props?.modification?.created_by?.fullname || '',
            interpolation: { escapeValue: false },
          })}
        </div>
      </NoteCardLayout.RightContent>
    </NoteCardLayout>
  );
};

ModificationNoteCard.defaultProps = {
  isLoading: false,
  withAvatar: false,
  hasActions: false,
};

export const ModificationNoteCardTranslated: ComponentType<Props> =
  withNamespaces()(ModificationNoteCard);
export default ModificationNoteCard;
