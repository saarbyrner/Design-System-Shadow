// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Typography } from '@kitman/playbook/components';
import { RichTextDisplay } from '@kitman/components';
import type { MedicalFile } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  document: MedicalFile,
  hasNotes: boolean,
};

const PresentationView = (props: I18nProps<Props>) => {
  return (
    <>
      {props.hasNotes ? (
        <>
          <Typography
            sx={{ fontWeight: '600', marginBottom: '14px' }}
            data-testid="DocumentDetailsTab|NoteTitle"
            variant="body2"
          >
            {props.document.annotation?.title}
          </Typography>
          <RichTextDisplay
            value={props.document.annotation?.content}
            isAbbreviated={false}
            data-testid="DocumentDetailsTab|NoteContent"
          />
        </>
      ) : (
        <Typography
          variant="body2"
          data-testid="DocumentDetailsTab|NoNotesAssociated"
        >
          {props.t('No associated notes.')}
        </Typography>
      )}
    </>
  );
};

export const PresentationViewTranslated: ComponentType<Props> =
  withNamespaces()(PresentationView);
export default PresentationView;
