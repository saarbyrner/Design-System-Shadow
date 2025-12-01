import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockedScreenDrugToDrug } from '@kitman/services/src/mocks/handlers/medical/screenDrugToDrug';
import { data as mockedScreenAllergyToDrug } from '@kitman/services/src/mocks/handlers/medical/screenAllergyToDrug';

import ScreenDrugsModal from '../index';

describe('<ScreenDrugsModal />', () => {
  const props = {
    isDeleteModalShown: true,
    getDeletableDocumentName: jest.fn(),
    openModal: true,
    setOpenModal: jest.fn(),
    screenAllergyErrors: mockedScreenAllergyToDrug,
    screenDrugErrors: mockedScreenDrugToDrug,
    dispenseOnSave: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('displays the modal title', () => {
    render(<ScreenDrugsModal {...props} />);
    expect(
      screen.getByText((content) => content.startsWith('Warning!'))
    ).toBeInTheDocument();
  });

  it('displays the drug alert content', () => {
    render(<ScreenDrugsModal {...props} />);
    expect(screen.getByText('Interaction 1 (Drug):')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Coumadin 6 mg tablet and ibuprofen 400 mg tablet may interact based on the potential interaction between SELECTED ANTICOAGULANTS (VIT K ANTAGONISTS) and NSAIDS.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Severity:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Severe Interaction: Action is required to reduce the risk of severe adverse interaction.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Clinical Effect:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Concurrent use of anticoagulants and NSAIDs may increase the risk for bleeding.'
      )
    ).toBeInTheDocument();
  });

  it('displays the allergy alert content', () => {
    render(<ScreenDrugsModal {...props} />);
    expect(screen.getByText('Interaction 2 (Allergy):')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The use of ibuprofen 400 mg tablet may result in an allergic reaction based on a reported history of a reaction to ibuprofen in which Itching was experienced.'
      )
    ).toBeInTheDocument();
  });

  it('displays the modal actions', () => {
    render(<ScreenDrugsModal {...props} />);
    const modalFooter = screen.getByTestId('Modal|Footer');

    const cancelButton = modalFooter.querySelector('button');
    expect(cancelButton).toBeInTheDocument();

    const destructButton = modalFooter.querySelectorAll('button')[1];
    expect(destructButton).toBeInTheDocument();
    expect(screen.getByText('Dispense Medication')).toBeInTheDocument();
  });
});
