// @flow
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { fitContentMenuCustomStyles } from '@kitman/components/src/Select';
import getDrillLabels from '@kitman/modules/src/PlanningHub/src/services/getDrillLabels';
import {
  FileUploadArea,
  FileUploadField,
  FormValidator,
  InputText,
  RichTextEditor,
  Select,
  SlidingPanel,
  TextButton,
  TooltipMenu,
} from '@kitman/components';
import type { EventActivity } from '@kitman/common/src/types/Event';
import type { DrillLabel } from '@kitman/modules/src/PlanningHub/src/services/getDrillLabels';
import { getValidHref } from '@kitman/common/src/utils';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  activity: EventActivity | null,
  onClose: Function,
  onUpdateActivityDrill: Function,
};

const getAvailableDrillLabelsById = (response: Array<DrillLabel>) =>
  response.reduce((labelsById, label) => {
    // eslint-disable-next-line no-param-reassign
    labelsById[label.id] = label;
    return labelsById;
  }, {});

const transformedDrillLabelResponse = (response: Array<DrillLabel>) =>
  response.map((label) => ({
    label: label.name,
    value: label.id,
  }));

const emptyHTMLeditorContent = '<p><br></p>';

export const INITIAL_DRILL_ATTRIBUTES = {
  name: '',
  sets: null,
  reps: null,
  rest_duration: null,
  pitch_width: null,
  pitch_length: null,
  notes: emptyHTMLeditorContent,
  diagram: null,
  attachments: [],
  links: [],
  event_activity_drill_label_ids: [],
};

const ActivityDrillPanel = (props: I18nProps<Props>) => {
  const [drill, setDrill] = useState(
    props.activity?.event_activity_drill || INITIAL_DRILL_ATTRIBUTES
  );
  const [availableDrillLabelsById, setAvailableDrillLabelsById] = useState<{
    string: DrillLabel,
  }>({});
  const [drillLabelOptions, setDrillLabelOptions] = useState([]);
  const [requestStatus, setRequestStatus] = useState<
    'LOADING' | 'SUCCESS' | 'FAILED'
  >('LOADING');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [nonUploadedFile, setNonUploadedFile] = useState(null);
  const [nonUploadedMultiFiles, setNonUploadedMultiFiles] = useState<
    Array<AttachedFile>
  >([]);
  const [multiFileUploadVisible, setMultiFileUploadVisible] = useState(false);
  const [diagram, setDiagram] = useState(
    props.activity?.event_activity_drill?.diagram || null
  );
  const [attachments, setAttachments] = useState(
    props.activity?.event_activity_drill?.attachments || []
  );

  const fetchDrillLabels = () => {
    getDrillLabels(true)
      .then(
        (fetchedDrillLabels) => {
          setDrillLabelOptions(
            transformedDrillLabelResponse(fetchedDrillLabels)
          );
          setAvailableDrillLabelsById(
            getAvailableDrillLabelsById(fetchedDrillLabels)
          );
        },
        () => setRequestStatus('FAILED')
      )
      .finally(() => {
        setRequestStatus('SUCCESS');
      });
  };

  useEffect(() => {
    setDrill(props.activity?.event_activity_drill || INITIAL_DRILL_ATTRIBUTES);
    setMultiFileUploadVisible(
      // $FlowFixMe activity exists here
      props.activity?.event_activity_drill?.attachments.length > 0
    );
    setDiagram(props.activity?.event_activity_drill?.diagram);
    setAttachments(props.activity?.event_activity_drill?.attachments);
  }, [props.activity]);

  useEffect(() => {
    fetchDrillLabels();
  }, []);

  useEffect(() => {
    if (!props.isOpen) {
      setNonUploadedMultiFiles([]);
    }
  }, [props.isOpen]);

  const style = {
    content: css`
      height: calc(100vh - 157px);
      padding: 0 24px 60px;
      overflow: auto;
    `,
    row: css`
      margin-bottom: 16px;
      width: 100%;
    `,
    fileUploadLabel: css`
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
    `,
    drillLinkTitleInput: css`
      flex: 1;
      margin-right: 5px;
    `,
    drillLinkURLInput: css`
      flex: 1.5;
      margin-left: 5px;
    `,
    actions: css`
      background: ${colors.white};
      border-top: 1px solid ${colors.s14};
      bottom: 0;
      display: flex;
      justify-content: space-between;
      left: 0;
      padding: 30px;
      position: absolute;
      width: 100%;
    `,
    urlRow: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: stretch;
      margin-bottom: 10px;

      a {
        margin-left: 12px;
      }

      label {
        display: none;
      }

      &:first-of-type {
        label {
          display: inline-block;
        }
      }
    `,
    fileUploadWrapper: css`
      .kitmanHeading--L3 {
        color: ${colors.grey_100};
        font-size: 12px;
        font-weight: 600;
      }
      .fileUploadField--fileTitleFields .unuploaded_files_titles span {
        font-size: 12px;
      }
    `,
  };

  const updateDrillTitle = (newValue: string) => {
    setDrill({
      ...drill,
      name: newValue,
    });
  };

  const updateDrillLabels = (selectedLabelIds: Array<number>) => {
    const newLabels = [];
    selectedLabelIds.forEach((labelId) => {
      newLabels.push(availableDrillLabelsById[labelId]);
    });
    setDrill({
      ...drill,
      event_activity_drill_labels: newLabels,
    });
  };

  const updateDrillNotes = (newValue: string) => {
    setDrill({
      ...drill,
      notes: newValue,
    });
  };

  const onUpdateDrillAttachment = (filePondFiles: Array<Object>) => {
    setNonUploadedFile(filePondFiles.length > 0 ? filePondFiles[0] : null);
  };

  const onRemoveDrillAttachment = () => {
    setDiagram(null);
    setDrill({
      ...drill,
      diagram: null,
    });
  };

  const onRemoveMultipleDrillAttachment = (fileId: number) => {
    const newAttachments = drill.attachments.filter(
      // $FlowFixMe id must exists here
      (file) => file.id !== fileId
    );
    setDrill({
      ...drill,
      attachments: newAttachments,
    });
    setAttachments(newAttachments);
  };

  const updateDrillLinkTitle = (newValue: string, index: number) => {
    const newLinks = [...drill.links];
    newLinks[index].title = newValue;
    setDrill({
      ...drill,
      links: newLinks,
    });
  };

  const updateDrillLinkURL = (newValue: string, index: number) => {
    const newLinks = [...drill.links];
    newLinks[index].uri = newValue;
    setDrill({
      ...drill,
      links: newLinks,
    });
  };

  const addDrillLinkRow = () => {
    const newLinks = [...drill.links];
    newLinks.push({
      title: '',
      uri: '',
    });
    setDrill({
      ...drill,
      links: newLinks,
    });
  };

  const removeDrillLinkRow = (index: number) => {
    const newLinks = [...drill.links];
    newLinks.splice(index, 1);
    setDrill({
      ...drill,
      links: newLinks,
    });
  };

  const onClosePanel = () => {
    setIsEditingNotes(false);
    props.onClose();
  };

  const onSaveDrill = () => {
    if (multiFileUploadVisible && checkInvalidFileTitles(nonUploadedMultiFiles))
      return;
    setIsEditingNotes(false);
    props.onUpdateActivityDrill(drill, nonUploadedFile, nonUploadedMultiFiles);
  };

  const renderDrillLinks = () => {
    return (
      drill.links?.length > 0 &&
      drill.links.map((link, index) => {
        return link.id ? (
          // $FlowFixMe id exists here
          <div css={style.urlRow} key={link.id}>
            <a
              href={getValidHref(link.uri)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title}
            </a>
            <TextButton
              iconBefore="icon-close"
              type="subtle"
              onClick={() => removeDrillLinkRow(index)}
              kitmanDesignSystem
            />
          </div>
        ) : (
          /* eslint-disable-next-line react/no-array-index-key */
          <div css={style.urlRow} key={index}>
            <div css={style.drillLinkTitleInput}>
              <InputText
                label={props.t('Title')}
                value={link.title}
                onValidation={(input) =>
                  updateDrillLinkTitle(input.value, index)
                }
                kitmanDesignSystem
                name="drill_attachment_link_title"
              />
            </div>
            <div css={style.drillLinkURLInput}>
              <InputText
                label={props.t('Link URL')}
                value={link.uri}
                onValidation={(input) => updateDrillLinkURL(input.value, index)}
                kitmanDesignSystem
                name="drill_attachment_link_uri"
              />
            </div>
            <TextButton
              iconBefore="icon-close"
              type="subtle"
              onClick={() => removeDrillLinkRow(index)}
              kitmanDesignSystem
            />
          </div>
        );
      })
    );
  };

  return (
    <div className="activityDrillPanel">
      <SlidingPanel
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={props.t('Drill')}
        togglePanel={onClosePanel}
      >
        <FormValidator
          successAction={onSaveDrill}
          inputNamesToIgnore={['filepond']}
        >
          <div css={style.content}>
            <div css={style.row}>
              <InputText
                placeholder={props.t('Title')}
                value={drill.name}
                label=""
                onValidation={(input) => updateDrillTitle(input.value)}
                kitmanDesignSystem
              />
            </div>
            <div css={style.row}>
              <Select
                customSelectStyles={fitContentMenuCustomStyles}
                label={props.t('Drill label(s)')}
                options={drillLabelOptions}
                isMulti
                appendToBody
                isDisabled={requestStatus !== 'SUCCESS'}
                onChange={(selectedItems) => updateDrillLabels(selectedItems)}
                value={
                  drill.event_activity_drill_labels
                    ? drill.event_activity_drill_labels.map((label) => label.id)
                    : []
                }
                optional
              />
            </div>
            <div css={style.row}>
              <label css={style.fileUploadLabel}>
                {props.t('Attach drill diagram')}
              </label>
              <FileUploadField
                updateFiles={(files) => onUpdateDrillAttachment(files)}
                files={diagram ? [diagram] : []}
                removeFiles={!props.isOpen}
                removeUploadedFile={onRemoveDrillAttachment}
                allowMultiple={false}
                maxFiles={1}
                labelIdleText={props.t(
                  'Drag and drop drill diagram or click here to browse.'
                )}
                allowImagePreview
                allowUploadedImagePreview
                acceptedFileTypes={[
                  'application/pdf',
                  'image/jpeg',
                  'image/jpg',
                  'image/png',
                ]}
                kitmanDesignSystem
              />
            </div>
            <div css={style.row}>
              <RichTextEditor
                label={props.t('Notes')}
                onChange={(note) => {
                  setIsEditingNotes(true);
                  updateDrillNotes(note);
                }}
                value={drill.notes}
                kitmanDesignSystem
                canSetExternally={!isEditingNotes}
              />
            </div>
            <div css={style.row}>
              <TooltipMenu
                appendToParent
                placement="bottom-end"
                offset={[0, 5]}
                menuItems={[
                  {
                    description: props.t('Attachment'),
                    isDisabled: multiFileUploadVisible,
                    onClick: () => setMultiFileUploadVisible(true),
                  },
                  {
                    description: props.t('Link'),
                    onClick: () => addDrillLinkRow(),
                  },
                ]}
                tooltipTriggerElement={
                  <TextButton
                    text={props.t('Add')}
                    iconAfter="icon-chevron-down"
                    type="secondary"
                    kitmanDesignSystem
                  />
                }
                kitmanDesignSystem
              />
            </div>
            <div css={style.row}>
              {multiFileUploadVisible && (
                <div css={style.fileUploadWrapper}>
                  <FileUploadArea
                    showActionButton={false}
                    testIdPrefix="ActivityDrill"
                    isFileError={false}
                    areaTitle={props.t('Attach file(s)')}
                    areaTitleSubtext={props.t(
                      'Accepted files: jpg, gif, png, pdf, mp4, mp3, mov, m4v'
                    )}
                    updateFiles={setNonUploadedMultiFiles}
                    files={attachments}
                    attachedFiles={nonUploadedMultiFiles}
                    removeUploadedFile={onRemoveMultipleDrillAttachment}
                    allowMultiple
                    removeFiles={!props.isOpen}
                    labelIdleText={props.t(
                      'Drag and drop files or click here to browse.'
                    )}
                    acceptedFileTypeCode="imageVideo"
                    allowOpenUploadedFile
                  />
                </div>
              )}
            </div>
            <div css={style.row}>{renderDrillLinks()}</div>
            <div css={style.actions}>
              <TextButton
                text={props.t('Cancel')}
                type="secondary"
                onClick={onClosePanel}
                kitmanDesignSystem
              />
              <TextButton
                text={props.t('Save')}
                type="primary"
                kitmanDesignSystem
                isSubmit
              />
            </div>
          </div>
        </FormValidator>
      </SlidingPanel>
    </div>
  );
};

export const ActivityDrillPanelTranslated =
  withNamespaces()(ActivityDrillPanel);
export default ActivityDrillPanel;
