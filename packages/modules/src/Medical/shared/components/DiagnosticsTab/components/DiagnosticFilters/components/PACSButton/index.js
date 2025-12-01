// @flow

import { TextButton } from '@kitman/components';
import type { DiagnosticTabFormState } from '../../../../contexts/DiagnosticTabFormContext';

type Props = {
  href: string,
  textForButton: string,
  isRedoxOrg: boolean,
  diagnosticTabFormState: DiagnosticTabFormState,
};

const PACSButton = ({
  href,
  textForButton,
  isRedoxOrg,
  diagnosticTabFormState,
}: Props) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <TextButton
        data-testid="DiagnosticFilters|PACSbutton"
        text={textForButton}
        type="secondary"
        kitmanDesignSystem
        isDisabled={
          isRedoxOrg &&
          diagnosticTabFormState?.queuedReconciledDiagnostics?.length > 0
        }
      />
    </a>
  );
};

export default PACSButton;
