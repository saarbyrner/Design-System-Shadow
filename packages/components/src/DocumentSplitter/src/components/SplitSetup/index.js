// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button, Divider } from '@kitman/playbook/components';

import {
  DocumentDetails,
  SplitOptions,
} from '@kitman/components/src/DocumentSplitter/src/sections';
import {
  selectDocumentDetails,
  selectSplitOptions,
  updateDetails,
  updateSplitOptions,
} from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import Layout from '@kitman/components/src/DocumentSplitter/src/layout';
import {
  validateDocumentDetails,
  validateSplitOptions,
} from '@kitman/components/src/DocumentSplitter/src/shared/utils/validation';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/playbook/types';
import type {
  PartialData as DocumentDetailsPartialData,
  Validation as DocumentDetailsValidation,
} from '@kitman/components/src/DocumentSplitter/src/sections/DocumentDetails/types';
import type {
  PartialData as SplitOptionsPartialData,
  Validation as SplitOptionsValidation,
} from '@kitman/components/src/DocumentSplitter/src/sections/SplitOptions/types';

type Props = {
  players: Array<Option>,
  documentCategories: Array<Option>,
  isFetchingPlayers: boolean,
  isFetchingDocumentCategories: boolean,
  isBackAvailable: boolean,
  totalPages: number,
  onNextCallback: () => void,
  onBackCallback: () => void,
};

const SplitSetup = ({
  t,
  players,
  documentCategories,
  isFetchingPlayers,
  isFetchingDocumentCategories,
  isBackAvailable,
  totalPages,
  onNextCallback,
  onBackCallback,
}: I18nProps<Props>) => {
  const [allowValidation, setAllowValidation] = useState<boolean>(false);

  const dispatch = useDispatch();
  const documentDetailsData = useSelector(selectDocumentDetails);
  const splitOptionsData = useSelector(selectSplitOptions);

  const documentDetailsValidation: DocumentDetailsValidation = useMemo(
    () => validateDocumentDetails(documentDetailsData, allowValidation),
    [documentDetailsData, allowValidation]
  );

  const splitOptionsValidation: SplitOptionsValidation = useMemo(
    () => validateSplitOptions(splitOptionsData, totalPages, allowValidation),
    [splitOptionsData, allowValidation, totalPages]
  );

  const updateDocumentDetails = (data: DocumentDetailsPartialData) => {
    dispatch(updateDetails(data));
  };

  const updateDocumentSplitOptions = (data: SplitOptionsPartialData) => {
    dispatch(updateSplitOptions(data));
  };

  const prepareToGoNext = () => {
    const validatedDocumentDetails = validateDocumentDetails(
      documentDetailsData,
      true
    );
    const validatedSplitOptions = validateSplitOptions(
      splitOptionsData,
      totalPages,
      true
    );

    if (
      validatedDocumentDetails.hasErrors === false &&
      validatedSplitOptions.hasErrors === false
    ) {
      onNextCallback();
    }
    setAllowValidation(true);
  };

  const validationFailed =
    allowValidation &&
    (documentDetailsValidation.hasErrors || splitOptionsValidation.hasErrors);

  return (
    <Layout>
      <Layout.Title title={t('Attach')} />
      <Layout.Content>
        <DocumentDetails
          players={players}
          documentCategories={documentCategories}
          isFetchingPlayers={isFetchingPlayers}
          isFetchingDocumentCategories={isFetchingDocumentCategories}
          data={documentDetailsData}
          validation={documentDetailsValidation}
          handleChange={updateDocumentDetails}
        />
        <SplitOptions
          data={splitOptionsData}
          validation={splitOptionsValidation}
          handleChange={updateDocumentSplitOptions}
        />
      </Layout.Content>
      <Divider />
      <Layout.Actions>
        {isBackAvailable ? (
          <Button color="secondary" onClick={onBackCallback}>
            {t('Back')}
          </Button>
        ) : (
          <div />
        )}
        <Button disabled={validationFailed} onClick={prepareToGoNext}>
          {t('Next')}
        </Button>
      </Layout.Actions>
    </Layout>
  );
};

export const SplitSetupTranslated = withNamespaces()(SplitSetup);
export default SplitSetup;
