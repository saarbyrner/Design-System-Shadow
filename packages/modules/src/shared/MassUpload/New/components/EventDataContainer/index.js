// @flow
import { type ParseState } from '@kitman/modules/src/shared/MassUpload/types';
import { type SetState } from '@kitman/common/src/types/react';
import { type SourceFormDataResponse } from '@kitman/modules/src/shared/MassUpload/services/getSourceFormData';
import { type IntegrationEvents } from '@kitman/modules/src/shared/MassUpload/services/getIntegrationData';

import IntegrationSelector from '../IntegrationSelector';
import IntegrationImportsTable from '../IntegrationImportsTable';
import IntegrationImportDetailTable from '../IntegrationImportDetailTable';

type Props = {
  activeStep: number,
  setActiveStep: SetState<number>,
  setHasErrors: SetState<boolean>,
  selectedIntegration: {
    id: number | string,
    name: string,
    sourceIdentifier: string,
  },
  setSelectedIntegration: SetState<{ id: number | string, name: string }>,
  integrationData: SourceFormDataResponse,
  hasErrors: boolean,
  eventTime: Date,
  eventType: string,
  integrationEvents: IntegrationEvents,
  selectedApiImport: string | null,
  setSelectedApiImport: SetState<string | null>,
  headerHeight: number,
  parseState: ParseState,
  renderDormantState: () => React$Node,
};

const EventDataContainer = ({
  activeStep,
  selectedIntegration,
  setSelectedIntegration,
  selectedApiImport,
  setActiveStep,
  setSelectedApiImport,
  setHasErrors,
  integrationData,
  integrationEvents,
  eventTime,
  eventType,
  hasErrors,
  headerHeight,
  parseState,
  renderDormantState,
}: Props) => {
  if (activeStep === 0) {
    return (
      <IntegrationSelector
        integrationData={integrationData}
        selectedIntegration={selectedIntegration}
        setSelectedIntegration={setSelectedIntegration}
        headerHeight={headerHeight}
        parseState={parseState}
        integrationEvents={integrationEvents}
        eventTime={eventTime}
        hasErrors={hasErrors}
      />
    );
  }
  if (activeStep === 1 && selectedIntegration.name !== 'CSV') {
    return (
      <IntegrationImportsTable
        selectedIntegration={selectedIntegration}
        integrationEvents={integrationEvents}
        selectedApiImport={selectedApiImport}
        setSelectedApiImport={setSelectedApiImport}
        eventType={eventType}
        eventTime={eventTime}
        resetState={() => {
          setActiveStep(0);
          setSelectedApiImport(null);
          setHasErrors(true);
        }}
      />
    );
  }
  if (activeStep === 2 && selectedApiImport) {
    return (
      <IntegrationImportDetailTable
        selectedApiImport={selectedApiImport}
        integrationEvents={integrationEvents}
      />
    );
  }
  return renderDormantState();
};

export default EventDataContainer;
