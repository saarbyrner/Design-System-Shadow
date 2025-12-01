// @flow
import { useState, useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import {
  Accordion,
  RichTextDisplay,
  RichTextEditor,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AthleteAvatar from './AthleteAvatar';
import TimezonesContext from '../../contexts/TimezonesContext';
import type {
  CommentsViewType,
  Athlete,
  Comments,
  Comment,
} from '../../../types';

type Props = {
  viewType: CommentsViewType,
  isCurrentSquad: boolean,
  isOpen: boolean,
  athletes: Array<Athlete>,
  selectedAthlete: Athlete,
  comments: Comments,
  canAnswerAssessment: boolean,
  onSave: Function,
  onClose: Function,
  onChangeViewType: Function,
  onChangeSelectedAthlete: Function,
};

const emptyHTMLeditorContent = '<p><br></p>';

const isEmptyComment = (comment: Comment) =>
  !comment.note ||
  comment.note?.content === '' ||
  comment.note?.content === emptyHTMLeditorContent;

const areEmptyAllComments = (comments: Comments) =>
  comments.every((comment) => isEmptyComment(comment));

const getFormattedDate = (date: string, timezone: string) => {
  const dateInTimezone = moment(date).tz(timezone);
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({
      date: dateInTimezone,
      showTime: true,
    });
  }

  return dateInTimezone.format('DD MMM YYYY [at] h:mm a');
};

const CommentsSidePanel = (props: I18nProps<Props>) => {
  const selectedAthleteIndex = props.athletes.findIndex(
    (athlete) => athlete.id === props.selectedAthlete.id
  );
  const isAthletesNavigationAllowed =
    props.viewType === 'VIEW' && props.athletes.length > 2;

  const [comments, setComments] = useState(props.comments);
  const [areCommentsExpanded, setAreCommentsExpanded] = useState(true);
  const [areEditedComments, setAreEditedComments] = useState(false);
  const timezone = useContext(TimezonesContext);

  useEffect(() => {
    setComments(props.comments);
  }, [props.comments]);

  const getPreviousAthleteIndex = () => {
    if (selectedAthleteIndex === 0) {
      return props.athletes.length - 1;
    }

    return selectedAthleteIndex - 1;
  };

  const getNextAthleteIndex = () => {
    if (selectedAthleteIndex === props.athletes.length - 1) {
      return 0;
    }

    return selectedAthleteIndex + 1;
  };

  const previousAthleteFullname =
    props.athletes[getPreviousAthleteIndex()]?.fullname;
  const nextAthleteFullname = props.athletes[getNextAthleteIndex()]?.fullname;

  const onChangeComment = (contentComment: string, currentComment: Comment) => {
    if (
      contentComment !== currentComment.note?.content &&
      contentComment !== emptyHTMLeditorContent
    ) {
      setAreEditedComments(true);
    }

    const newComments = comments.map((comment) =>
      comment.assessmentItemId === currentComment.assessmentItemId
        ? {
            ...comment,
            note: {
              content: contentComment,
              createdAt: currentComment.note?.createdAt,
            },
          }
        : comment
    );

    setComments(newComments);
  };

  const getEditionViewComments = () =>
    comments.map((comment, index) => (
      <div
        className="commentsSidePanel__comment"
        key={`${comment.assessmentItemId}_${props.selectedAthlete.id}`}
      >
        <Accordion
          title={
            <div className="commentsSidePanel__commentHead">
              <p>{comment.assessmentItemName}</p>
              <p>{`${index + 1}`}</p>
            </div>
          }
          content={
            <div className="commentsSidePanel__commentBody">
              <RichTextEditor
                onChange={(content) => {
                  onChangeComment(content, comment);
                }}
                value={comment.note?.content || ''}
                kitmanDesignSystem
              />
            </div>
          }
          isOpen={areCommentsExpanded}
        />
      </div>
    ));

  const getCommentDate = (createdAt?: string) => {
    if (createdAt) {
      return getFormattedDate(createdAt, timezone.orgTimezone);
    }

    return getFormattedDate(moment(new Date()), timezone.orgTimezone);
  };

  const getPresentationViewComments = () => {
    if (!areEmptyAllComments(props.comments)) {
      return props.comments.map((comment, index) => {
        if (isEmptyComment(comment)) {
          return null;
        }

        return (
          <div
            className="commentsSidePanel__comment"
            key={comment.assessmentItemId}
          >
            <Accordion
              title={
                <div className="commentsSidePanel__commentHead">
                  <p>{comment.assessmentItemName}</p>
                  <p>{`${index + 1}`}</p>
                </div>
              }
              content={
                <div className="commentsSidePanel__commentBody">
                  <div className="commentsSidePanel__commentDetail">
                    <p>
                      {comment.note && getCommentDate(comment.note.createdAt)}
                    </p>
                    {props.isCurrentSquad && (
                      <TextButton
                        onClick={() => props.onChangeViewType('EDIT')}
                        kitmanDesignSystem
                        isDisabled={!props.canAnswerAssessment}
                        type="link"
                        text={props.t('Edit')}
                      />
                    )}
                  </div>
                  <RichTextDisplay
                    value={comment.note?.content}
                    isAbbreviated={false}
                  />
                </div>
              }
              isOpen={areCommentsExpanded}
            />
          </div>
        );
      });
    }

    return (
      <div className="commentsSidePanel__noComments">
        {props.isCurrentSquad ? (
          <TextButton
            onClick={() => props.onChangeViewType('EDIT')}
            kitmanDesignSystem
            isDisabled={!props.canAnswerAssessment}
            type="link"
            text={props.t('Add comments')}
          />
        ) : (
          <p>{props.t('No comments')}</p>
        )}
      </div>
    );
  };

  const getEditedComments = () => {
    const editedComments = _differenceWith(comments, props.comments, _isEqual);

    return editedComments.map((comment) => ({
      assessment_item_id: comment.assessmentItemId,
      athlete_id: props.selectedAthlete.id,
      value: comment.note?.content,
    }));
  };

  return (
    <div className="commentsSidePanel">
      <SlidingPanel
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={
          props.viewType === 'VIEW'
            ? props.t('Comments')
            : props.t('Edit comments')
        }
        togglePanel={() => props.onClose()}
      >
        <div className="commentsSidePanel__content">
          {isAthletesNavigationAllowed ? (
            <div className="commentsSidePanel__athleteNavigation">
              <div>
                <TextButton
                  onClick={() =>
                    props.onChangeSelectedAthlete(getPreviousAthleteIndex())
                  }
                  iconBefore="icon-next-left"
                  kitmanDesignSystem
                  type="secondary"
                  text={previousAthleteFullname}
                  shouldFitContainer
                />
              </div>
              <AthleteAvatar
                highlighted
                imageUrl={props.selectedAthlete.avatar_url}
                name={props.selectedAthlete.fullname}
              />
              <div>
                <TextButton
                  onClick={() =>
                    props.onChangeSelectedAthlete(getNextAthleteIndex())
                  }
                  iconAfter="icon-next-right"
                  kitmanDesignSystem
                  type="secondary"
                  text={nextAthleteFullname}
                  shouldFitContainer
                />
              </div>
            </div>
          ) : (
            <div className="commentsSidePanel__athlete">
              <AthleteAvatar
                highlighted
                imageUrl={props.selectedAthlete.avatar_url}
                name={props.selectedAthlete.fullname}
              />
            </div>
          )}
          <div className="commentsSidePanel__commentsHeader">
            <p>{props.t('TYPE')}</p>
            <TextButton
              onClick={() =>
                setAreCommentsExpanded((areExpanded) => !areExpanded)
              }
              kitmanDesignSystem
              type="link"
              text={
                areCommentsExpanded ? props.t('Close all') : props.t('Open all')
              }
              isDisabled={
                areEmptyAllComments(props.comments) && props.viewType === 'VIEW'
              }
            />
          </div>
          <div className="commentsSidePanel__comments">
            {props.viewType === 'EDIT' ? (
              <div className="commentsSidePanel__editionViewComments">
                {getEditionViewComments()}
              </div>
            ) : (
              <div className="commentsSidePanel__presentationViewComments">
                {getPresentationViewComments()}
              </div>
            )}
          </div>
        </div>
        <div
          className={classnames('slidingPanelActions', {
            'slidingPanelActions--edition': props.viewType === 'EDIT',
          })}
        >
          {props.viewType === 'EDIT' && (
            <TextButton
              onClick={() => {
                setComments(props.comments);
                props.onChangeViewType('VIEW');
              }}
              type="secondary"
              kitmanDesignSystem
              text={props.t('Cancel')}
            />
          )}
          <TextButton
            onClick={() => {
              if (props.viewType === 'VIEW') {
                props.onClose();
              } else {
                props.onSave(getEditedComments());
              }
            }}
            type="primary"
            kitmanDesignSystem
            text={props.viewType === 'VIEW' ? props.t('Done') : props.t('Save')}
            isDisabled={props.viewType === 'EDIT' && !areEditedComments}
          />
        </div>
      </SlidingPanel>
    </div>
  );
};

export default CommentsSidePanel;
export const CommentsSidePanelTranslated = withNamespaces()(CommentsSidePanel);
