// @flow
import { useState } from 'react';
import uuid from 'uuid';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Checkbox } from '@kitman/components';
import { saveRedoxReviewed } from '@kitman/services';
import moment from 'moment';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DiagnosticResultsBlock } from '@kitman/modules/src/Medical/shared/types';
import style from '@kitman/modules/src/Medical/diagnostics/src/components/DiagnosticOverviewTab/styles';

type Props = {
  resultBlocks: DiagnosticResultsBlock,
  diagnosticId: number,
  setRequestStatus: Function,
};

const RadiologyReport = (props: I18nProps<Props>) => {
  const {
    reviewed,
    result_group_id: resultGroupId,
    completed_at: completedAt,
  } = props.resultBlocks;

  const [isReviewed, setIsReviewed] = useState<boolean>(reviewed || false);

  return (
    <section
      css={style.resultsSection}
      data-testid="DiagnosticOverviewTab|RadiologyReport"
    >
      <div css={style.resultsSectionHeader}>
        <h2>
          {props.t('Results')}
          {completedAt ? ` - ${moment(completedAt).format('L hh:mm a')}` : null}
        </h2>

        <Checkbox
          id="RadiologyReportReviewed"
          isChecked={isReviewed}
          label={props.t('Marked as reviewed')}
          toggle={() => {
            setIsReviewed(!isReviewed);
            saveRedoxReviewed(resultGroupId, props.diagnosticId, !isReviewed)
              .then(() => props.setRequestStatus('SUCCESS'))
              .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(
                  'ERROR IN Radiology Report saveRedoxReviewed catch: ',
                  err.responseText
                );
                // props.setRequestStatus('FAILURE');
              });
          }}
        />
      </div>
      <h4 css={style.descriptionHeading}>{props.t('Description')}</h4>
      <p />
      <hr />
      <h4 css={style.findingsHeading}>{props.t('Findings')}</h4>
      <div>
        {props.resultBlocks.results.map((result) => (
          <div key={uuid()}>
            {result.formatted_text?.map((content) => (
              <div css={style.redoxDataBlock} key={uuid()}>
                <h5>{content.head}</h5>
                <p>{content.body}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export const RadiologyReportTranslated: ComponentType<Props> =
  withNamespaces()(RadiologyReport);
export default RadiologyReport;
