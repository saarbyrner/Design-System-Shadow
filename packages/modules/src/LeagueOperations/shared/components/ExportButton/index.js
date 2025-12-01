// @flow
import { Fragment, type Node } from 'react';
import { withNamespaces } from 'react-i18next';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import Dropdown from '@kitman/modules/src/LeagueOperations/shared/components/Dropdown';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import exportHomegrownPlusNine from '@kitman/services/src/services/exports/exportHomegrownPlusNine';
import exportHomegrownFortyFive from '@kitman/services/src/services/exports/exportHomegrownFortyFive';
import exportHomegrownPostFormation from '@kitman/services/src/services/exports/exportHomegrownPostFormation';
import exportHomegrown from '@kitman/services/src/services/exports/exportHomegrown';
import exportPayment from '@kitman/services/src/services/exports/exportPayment';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Button } from '@kitman/playbook/components';

export type ExportItemType =
  | '45-csv'
  | '45-pdf'
  | '+9-csv'
  | '+9-pdf'
  | 'postformation-csv'
  | 'postformation-pdf'
  | 'homegrown-export' // for league export homegrown
  | 'payment-csv'
  | 'payment-pdf';

type Props = {
  allowedExports: Array<ExportItemType>,
};

const ExportButton = ({ t, allowedExports }: I18nProps<Props>): Node | null => {
  const { exportReports, toasts, closeToast } = useExports(null, true);

  const exportHandlers = {
    '45-csv': () => exportReports(() => exportHomegrownFortyFive('csv')),
    '45-pdf': () => exportReports(() => exportHomegrownFortyFive('pdf')),
    '+9-csv': () => exportReports(() => exportHomegrownPlusNine('csv')),
    '+9-pdf': () => exportReports(() => exportHomegrownPlusNine('pdf')),
    'postformation-csv': () =>
      exportReports(() => exportHomegrownPostFormation('csv')),
    'postformation-pdf': () =>
      exportReports(() => exportHomegrownPostFormation('pdf')),
    'homegrown-export': () => exportReports(() => exportHomegrown()),
    'payment-csv': () => exportReports(() => exportPayment('csv')),
    'payment-pdf': () => exportReports(() => exportPayment('pdf')),
  };
  const exportLabelMap = {
  '45-csv': t('45 export (CSV)'),
  '45-pdf': t('45 export (PDF)'),
  '+9-csv': t('+9 export (CSV)'),
  '+9-pdf': t('+9 export (PDF)'),
  'postformation-csv': t('Post-formation export (CSV)'),
  'postformation-pdf': t('Post-formation export (PDF)'),
  'homegrown-export': t('Export Homegrown'),
  'payment-csv': t('Payment Export (CSV)'),
  'payment-pdf': t('Payment Export (PDF)'),
};

  const items = allowedExports.map((type) => ({
    label: exportLabelMap[type],
    onClick: exportHandlers[type],
  }));

  if (!items.length) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown
        id="reg-org-export"
        Control={(props) => (
          <Button
            {...props}
            variant="contained"
            color="primary"
            size="medium"
            endIcon={<KeyboardArrowDown />}
          >
            Export
          </Button>
        )}
        items={items}
      />
      <ToastDialog toasts={toasts} onCloseToast={closeToast} />
    </Fragment>
  );
};

export default withNamespaces()(ExportButton);
