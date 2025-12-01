import { screen, render } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import injuryVariablesDummyData from '@kitman/modules/src/RiskAdvisor/resources/injuryVariablesDummyData';
import { severityOptions } from '@kitman/modules/src/RiskAdvisor/resources/filterOptions';

import VariableForm from '../index';

describe('Risk Advisor <VariableForm /> component', () => {
  const dataSources = {
    catapult: 'Catapult',
    kitman: 'Kitman',
    athlete: 'Athlete details',
    pain_indication: 'Pain',
  };

  const mockProps = {
    variable: { ...injuryVariablesDummyData[0] },
    selectedDataSources: [],
    dataSources,
    isVariableSaved: false,
    isKitmanAdmin: false,
    turnaroundList: [],
    positionGroupOptions: [
      {
        value: 23,
        label: 'Forward',
      },
      {
        value: 24,
        label: 'Back',
      },
      {
        value: 40,
        label: 'Other',
      },
    ],
    bodyAreaOptions: [
      {
        value: 23,
        label: 'ankle',
      },
      {
        value: 24,
        label: 'hamstring',
      },
      {
        value: 40,
        label: 'head',
      },
    ],
    severityOptions: severityOptions(),
    pipelineArnOptions: [
      {
        value: 'multivariate_analysis_experimental_state_machine',
        label: 'Multivariate Analysis Experimental',
      },
    ],
    onChangeDateRange: jest.fn(),
    onSelectPositionGroups: jest.fn(),
    onMultiSelectPositionGroups: jest.fn(),
    onSelectExposures: jest.fn(),
    onMultiSelectExposures: jest.fn(),
    onSelectMechanisms: jest.fn(),
    onMultiSelectMechanisms: jest.fn(),
    onApplyVariableFilters: jest.fn(),
    onSelectBodyArea: jest.fn(),
    onMultiSelectBodyArea: jest.fn(),
    onSelectAllPositionGroups: jest.fn(),
    onSelectAllExposures: jest.fn(),
    onSelectAllMechanisms: jest.fn(),
    onSelectAllBodyAreas: jest.fn(),
    onToggleHideVariable: jest.fn(),
    onSelectSeverities: jest.fn(),
    onSelectPipelineArn: jest.fn(),
    toggleDataSourcePanel: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<VariableForm {...mockProps} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders nothing when there is no variable selected', () => {
    const emptyVariable = {
      ...mockProps.variable,
      name: '',
    };

    const { container } = render(
      <VariableForm {...mockProps} variable={emptyVariable} />
    );

    expect(
      container.querySelector('.riskAdvisor__variableForm')
    ).not.toBeInTheDocument();
  });

  describe('when the variable is saved', () => {
    it('does not display the input form', () => {
      render(<VariableForm {...mockProps} isVariableSaved />);

      // EditForm components should not be present
      expect(screen.queryByLabelText('Position Group')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Exposure')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Mechanism')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Body area')).not.toBeInTheDocument();
    });

    it('displays a list of static data', () => {
      const { container } = render(
        <VariableForm {...mockProps} isVariableSaved />
      );

      const labels = container.querySelectorAll(
        '.riskAdvisor__savedVariableLabel'
      );
      const values = container.querySelectorAll(
        '.riskAdvisor__savedVariableVal'
      );

      expect(labels).toHaveLength(6);
      expect(values).toHaveLength(5);
    });

    it('renders the selected data sources', () => {
      render(<VariableForm {...mockProps} isVariableSaved />);

      expect(screen.getByText('Data sources')).toBeInTheDocument();
    });

    it('renders the correct text when all sources are selected', () => {
      const propsWithAllSources = {
        ...mockProps,
        selectedDataSources: [
          dataSources.catapult,
          dataSources.kitman,
          dataSources.athlete,
          dataSources.pain_indication,
        ],
      };

      render(<VariableForm {...propsWithAllSources} isVariableSaved />);

      expect(
        screen.getByText('All available data sources')
      ).toBeInTheDocument();
    });

    it('renders the correct text when some sources are selected', () => {
      const propsWithSomeSources = {
        ...mockProps,
        selectedDataSources: [
          dataSources.catapult,
          dataSources.kitman,
          dataSources.athlete,
        ],
      };

      render(<VariableForm {...propsWithSomeSources} isVariableSaved />);

      const expected = `${dataSources.catapult}, ${dataSources.kitman}, ${dataSources.athlete}`;
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  describe('when the variable is saved with selected filters', () => {
    const filteredVariable = {
      ...mockProps.variable,
      filter: {
        position_group_ids: [23, 24],
        exposure_types: [],
        mechanisms: [],
        osics_body_area_ids: [23, 24],
        severity: ['mild', 'moderate'],
      },
    };

    it('displays the correct filter names', () => {
      render(
        <VariableForm
          {...mockProps}
          variable={filteredVariable}
          isVariableSaved
        />
      );

      expect(screen.getByText('ankle')).toBeInTheDocument();
      expect(screen.getByText('hamstring')).toBeInTheDocument();
    });

    describe('when the "risk-advisor-metric-creation-filter-on-injuries-causing-unavailability" feature flag is enabled', () => {
      beforeEach(() => {
        window.setFlag(
          'risk-advisor-metric-creation-filter-on-injuries-causing-unavailability',
          true
        );
      });

      it('displays the correct filter names', () => {
        render(
          <VariableForm
            {...mockProps}
            variable={filteredVariable}
            isVariableSaved
          />
        );

        expect(screen.getByText('Mild (4-7 days)')).toBeInTheDocument();
        expect(screen.getByText('Moderate (8-28 days)')).toBeInTheDocument();
      });
    });
  });
});
