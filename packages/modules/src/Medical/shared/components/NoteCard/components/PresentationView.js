/* eslint-disable no-unused-vars */
// @flow
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { colors } from '@kitman/common/src/variables';
import {
  TextLink,
  TextTag,
  RichTextDisplay,
  TooltipMenu,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { getContentTypeIcon } from '@kitman/common/src/utils/mediaHelper';
import {
  getIssueTitle,
  getIssueTypePath,
} from '@kitman/modules/src/Medical/shared/utils';
import getStyles from '@kitman/modules/src/Medical/shared/components/NoteCard/styles';

// Types
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { NoteAction } from '../../../types';

type LayoutProps = {
  withVerticalLayout?: boolean,
  withBorder?: boolean,
};

type Props = {
  note: MedicalNote,
  actions?: Array<NoteAction>,
  showAthleteInformations?: boolean,
  layoutProps: LayoutProps,
  isLoading?: boolean,
};

const PresentationView = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();

  const style = getStyles(
    props.layoutProps?.withVerticalLayout,
    props.layoutProps?.withBorder
  );

  const getVisibility = () => {
    if (props.note.restricted_to_doc) return props.t('Doctors');
    if (props.note.restricted_to_psych) return props.t('Psych Team');
    return props.t('Default');
  };

  const linkedIssues = [
    ...props.note.illness_occurrences,
    ...props.note.injury_occurrences,
  ];
  const isActive = !props.note.expired;
  const menuItems = props.actions || [];

  return (
    <>
      <section
        data-testid="PresentationView|LeftContent"
        css={style.leftContent}
      >
        {props.showAthleteInformations && (
          <h2
            css={style.athleteDetails}
            className="kitmanHeading--L3"
            data-testid="PresentationView|AthleteInformations"
          >
            <img
              css={style.athleteAvatar}
              src={props.note.annotationable.avatar_url}
              alt={props.note.annotationable.fullname}
              data-testid="PresentationView|AthleteAvatar"
            />
            <TextLink
              text={props.note.annotationable.fullname}
              href={`/medical/athletes/${props.note.annotationable.id}`}
            />
          </h2>
        )}
        <h3 css={style.noteTitle} className="kitmanHeading--L4">
          <div>
            {(props.note.restricted_to_doc ||
              props.note.restricted_to_psych) && (
              <i css={style.lockIcon} className="icon-lock" />
            )}
            {props.note.title}
          </div>
          <div>
            {props.note.organisation_annotation_type.type !==
              'OrganisationAnnotationTypes::Modification' && (
              <span css={style.noteType}>
                <TextTag
                  content={props.note.organisation_annotation_type.name}
                />
              </span>
            )}
            {props.note.organisation_annotation_type.type ===
              'OrganisationAnnotationTypes::Modification' &&
              isActive && (
                <span css={style.noteStatus}>
                  <TextTag
                    content={props.t('Active')}
                    backgroundColor={colors.blue_300}
                    textColor={colors.white}
                  />
                </span>
              )}
          </div>
        </h3>
        <div css={style.noteDate} data-testid="PresentationView|Date">
          {DateFormatter.formatStandard({
            date: moment(props.note.annotation_date),
          })}

          {props.note.expiration_date &&
            ` - ${DateFormatter.formatStandard({
              date: moment(props.note.expiration_date),
            })}`}
        </div>

        <RichTextDisplay value={props.note.content} isAbbreviated={false} />
      </section>
      <section
        data-testid="PresentationView|RightContent"
        css={style.rightContent}
      >
        {permissions.medical.issues.canView && linkedIssues.length > 0 && (
          <div css={style.metadataSection}>
            <h4 css={style.metadataTitle} className="kitmanHeading--L6">
              {props.t('Linked injury/ illness')}
            </h4>
            <ul
              css={style.linkedIssuesList}
              data-testid="PresentationView|LinkedIssues"
            >
              {linkedIssues.map((issue) => (
                <li key={`${issue.issue_type}_${issue.id}`}>
                  {DateFormatter.formatStandard({
                    date: moment(issue.occurrence_date),
                  })}{' '}
                  -{' '}
                  <TextLink
                    text={getIssueTitle(issue, false)}
                    href={`/medical/athletes/${
                      props.note.annotationable.id
                    }/${getIssueTypePath(issue.issue_type)}/${issue.id}`}
                    kitmanDesignSystem
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {props.note.attachments.length > 0 && (
          <div css={style.metadataSection}>
            <h4 css={style.metadataTitle} className="kitmanHeading--L6">
              {props.t('Files')}
            </h4>
            <ul
              css={style.linkedIssuesList}
              data-testid="PresentationView|Attachments"
            >
              {props.note.attachments.map((attachment) => (
                <li key={attachment.filename}>
                  <a
                    data-testid="PresentationView|AttachmentLink"
                    target="_blank"
                    href={attachment.url}
                    css={style.attachmentLink}
                    rel="noreferrer"
                  >
                    <i
                      css={style.fileTypeIcon}
                      className={getContentTypeIcon(attachment.filetype)}
                    />{' '}
                    {attachment.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div css={style.metadataDualColumns}>
          <div css={style.metadataSection}>
            <div css={style.metadataTitleWrapper}>
              <h4 css={style.metadataTitle} className="kitmanHeading--L6">
                {props.t('Visibility')}
              </h4>
            </div>
            <div data-testid="PresentationView|Visibility">
              {getVisibility()}
            </div>
          </div>

          <div css={style.metadataSection}>
            <div css={style.metadataTitleWrapper}>
              <h4 css={style.metadataTitle} className="kitmanHeading--L6">
                {props.t('Roster')}
              </h4>
            </div>
            <div data-testid="PresentationView|Roster">
              {props.note.annotationable.athlete_squads
                .map(({ name }) => name)
                .join(', ')}
            </div>
          </div>
        </div>

        <div
          css={[style.metadataSection, style.authorDetails]}
          data-testid="PresentationView|AuthorDetails"
        >
          {props.t('Created {{date}} by {{author}}', {
            date: DateFormatter.formatStandard({
              date: moment(props.note.created_at),
            }),
            author: props?.note?.author?.fullname || '',
            interpolation: { escapeValue: false },
          })}
        </div>
      </section>
      {menuItems.length > 0 && isActive && (
        <section data-testid="PresentationView|Actions" css={style.actions}>
          <TooltipMenu
            placement="bottom-start"
            offset={[0, 0]}
            menuItems={menuItems.map((action) => ({
              key: action.id,
              description: action.text,
              onClick: () => action.onCallAction(props.note.id),
            }))}
            tooltipTriggerElement={
              <button css={style.actionButton} type="button">
                <i className="icon-more" />
              </button>
            }
            disabled={props.isLoading}
            kitmanDesignSystem
          />
        </section>
      )}
    </>
  );
};

export const PresentationViewTranslated = withNamespaces()(PresentationView);
export default PresentationView;
