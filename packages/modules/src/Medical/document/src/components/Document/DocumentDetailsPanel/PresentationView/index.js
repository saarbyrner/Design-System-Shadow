// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import { Typography } from '@kitman/playbook/components';
import type { LegalDocument } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/Medical/document/src/components/Document/styles';

type Props = {
  document: LegalDocument,
  currentDocumentCategories?: Array<{ id: number, name: string }>,
};

const PresentationView = (props: I18nProps<Props>) => {
  let docDate =
    props.document.document_date || props.document.attachment.created;

  if (
    window.featureFlags['medical-files-sort-by-doc-date'] &&
    props.document.entity
  ) {
    docDate = props.document.entity.entity_date;
  }

  return (
    <>
      <div css={style.row}>
        <>
          <Typography css={style.header} variant="body2">
            {props.t('Title')}:
          </Typography>
          <Typography
            variant="body2"
            data-testid="DocumentDetailsTab|TitleName"
          >
            {props.document.attachment.name}
          </Typography>
        </>
      </div>
      <div css={style.row}>
        <>
          <Typography css={style.header} variant="body2">
            {props.t('Category')}:
          </Typography>
          <Typography variant="body2">
            {props.currentDocumentCategories
              ?.map(({ name }) => name)
              .join(', ')}
          </Typography>
        </>
      </div>
      <div css={style.row}>
        <>
          <Typography css={style.header} variant="body2">
            {props.t('Date of document')}:
          </Typography>
          <Typography
            data-testid="DocumentDetailsTab|DocumentDate"
            variant="body2"
          >
            {docDate &&
              DateFormatter.formatStandard({
                date: moment(docDate),
              })}
          </Typography>
        </>
      </div>
    </>
  );
};

export const PresentationViewTranslated: ComponentType<Props> =
  withNamespaces()(PresentationView);
export default PresentationView;
