import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import InitialInformation from '..';

jest.mock('@kitman/components/src/Select');

describe('<InitialInformation />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    addOshaFormSidePanel: {
      isOpen: true,
      page: 1,
      initialInformation: {},
      employeeDrInformation: {},
      caseInformation: {},
    },
  });

  const defaultProps = {
    issue: {
      osha: {},
    },
    isOpen: true,
    t: i18nextTranslateStub(),
  };

  const useDispatchMock = jest.fn();
  mockStore.dispatch = useDispatchMock;

  it('should render contents as expected', () => {
    render(
      <Provider store={mockStore}>
        <InitialInformation {...defaultProps} />
      </Provider>
    );

    expect(
      screen.getByText(
        'This Injury and Illness Incident Report is one of the first forms you must fill out when a recordable work-related injury or illness has occurred. Together with the Log of Work-Related Injuries and Illnesses and the accompanying Summary, these forms help the employer and OSHA develop a picture of the extent and severity of work-related incidents.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Within 7 calendar days after you receive information that a recordable work-related injury or illness has occurred, you must fill out this form or an equivalent. Some state workers’ compensation, insurance, or other reports may be acceptable substitutes. To be considered an equivalent form, any substitute must contain all the information asked for on this form.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'According to Public Law 91-596 and 29 CFR 1904, OSHA’s recordkeeping rule, you must keep this form on file for 5 years following the year to which it pertains.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'If you need additional copies of this form, you may photocopy the printout or insert additional form pages in the PDF, and then use as many as you need.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddOshaSidePanel|CompletedBy')
    ).toBeInTheDocument();
    expect(screen.getByTestId('AddOshaSidePanel|Title')).toBeInTheDocument();
    expect(screen.getByTestId('AddOshaSidePanel|Phone')).toBeInTheDocument();
    expect(screen.getByTestId('AddOshaSidePanel|Date')).toBeInTheDocument();
  });
});
