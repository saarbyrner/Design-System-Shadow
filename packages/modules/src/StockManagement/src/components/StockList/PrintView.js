// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Printable } from '@kitman/printing/src/renderers';
import { StockManagementReport } from '@kitman/printing/src/templates';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { DrugLot } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  stockList: Array<DrugLot>,
};

function PrintView(props: I18nProps<Props>) {
  const { organisation } = useOrganisation();

  return (
    <Printable>
      <StockManagementReport
        organisationLogo={organisation.logo_full_path}
        organisationName={organisation.name}
        stockList={props.stockList}
        labels={{
          drugName: props.t('Name'),
          drugStrength: props.t('Strength'),
          type: props.t('Type'),
          lotNumber: props.t('Lot no.'),
          expirationDate: props.t('Exp date.'),
          dispensed: props.t('Dispensed'),
          onHand: props.t('On hand'),
        }}
      />
    </Printable>
  );
}

export const PrintViewTranslated: ComponentType<Props> =
  withNamespaces()(PrintView);
export default PrintView;
