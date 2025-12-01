// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  Box,
  Button,
  Chip,
  Typography,
  RichTextEditor,
} from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import type { ElementRef } from 'react';
import { v2styles as styles } from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/styles';
import {
  cellNotBeingEditedValue,
  richTextEditorContentWrapperLength,
} from '../utils/utils';

type UpdateCoachesNoteInlinePayLoadType = (payload: {
  athleteId: number,
  includeCopiedFrom: boolean,
  organisationAnnotationTypes: Array<string>,
  beforeDate: string,
}) => void;

type RichTextEditorProps = {
  resetCoachesReportPayloadNextId: () => void,
  updateCoachesNoteInlinePayLoad: UpdateCoachesNoteInlinePayLoadType,
  dataGridCurrentDate: string,
  editingCellId: number,
  initValue: string,
  noteContent: string,
  setNoteContent: (content: string) => void,
  setEditingCellId: (id: number) => void,
  isModalOpen: boolean,
  handleAddNote: (event: SyntheticEvent<HTMLElement>) => void,
  editorRef: ElementRef<any>,
  canCreateNotes: boolean,
  richTextEditorIsInFocus: boolean,
  setRichTextEditorIsInFocus: (isInFocus: boolean) => void,
};

const renderRichTextEditor = ({
  updateCoachesNoteInlinePayLoad,
  dataGridCurrentDate,
  editingCellId,
  initValue,
  noteContent,
  setNoteContent,
  setEditingCellId,
  isModalOpen,
  handleAddNote,
  editorRef,
  canCreateNotes,
  richTextEditorIsInFocus,
  setRichTextEditorIsInFocus,
  resetCoachesReportPayloadNextId,
}: RichTextEditorProps) => {
  const handleCopyLastReportInline = (athleteId: number = -1): void => {
    resetCoachesReportPayloadNextId();
    const payload = {
      athleteId,
      includeCopiedFrom: true,
      organisationAnnotationTypes: [
        'OrganisationAnnotationTypes::DailyStatusNote',
      ],
      beforeDate: dataGridCurrentDate,
    };

    updateCoachesNoteInlinePayLoad(payload);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '.ProseMirror.remirror-editor': { overflowY: 'auto', cursor: 'text' },
        '.remirror-editor-wrapper': { paddingBottom: '2.5rem' },
      }}
    >
      {!isModalOpen && (
        <>
          <Box sx={styles.inlineRichtextEditorButtons}>
            <Button onClick={() => setEditingCellId(cellNotBeingEditedValue)}>
              {i18n.t('Cancel')}
            </Button>
            <Button onClick={handleAddNote} disabled={noteContent?.length <= 7}>
              {i18n.t('Save')}
            </Button>
          </Box>
          {!initValue &&
            noteContent?.length <= richTextEditorContentWrapperLength &&
            !richTextEditorIsInFocus &&
            canCreateNotes && (
              <Button sx={styles.inlineCopyLastNoteButton}>
                <Chip
                  sx={{
                    width: '100%',
                    height: '100%',
                  }}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ paddingRight: '0.4rem' }}>
                        <KitmanIcon name={KITMAN_ICON_NAMES.FileCopyOutlined} />
                      </Box>
                      <Typography variant="body2">
                        {i18n.t('Copy last note')}
                      </Typography>
                    </Box>
                  }
                  color="default"
                  size="medium"
                  variant="filled"
                  onClick={() => {
                    handleCopyLastReportInline(editingCellId);
                  }}
                />
              </Button>
            )}
        </>
      )}
      <Box
        onFocus={() => setRichTextEditorIsInFocus(true)}
        onBlur={() => setRichTextEditorIsInFocus(false)}
      >
        <RichTextEditor
          value={initValue}
          forwardedRef={editorRef}
          sx={{ height: '12.5rem' }}
          onChange={(newNoteValue) => {
            if (noteContent !== newNoteValue) {
              setNoteContent(newNoteValue);
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default renderRichTextEditor;
