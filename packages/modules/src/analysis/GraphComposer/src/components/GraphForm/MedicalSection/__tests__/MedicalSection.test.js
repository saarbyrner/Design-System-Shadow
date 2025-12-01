import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MedicalSection from '..';

describe('Graph Composer <MedicalSection /> component', () => {
  const i18nT = i18nextTranslateStub();

  const squadAthletes = {
    position_groups: [
      {
        id: '1',
        name: 'Position Group',
        positions: [
          {
            id: '1',
            name: 'Position',
            athletes: [
              {
                id: '1',
                fullname: 'Athete',
              },
            ],
          },
        ],
      },
    ],
  };

  const squadSelection = {
    athletes: [],
    positions: [],
    position_groups: [],
    applies_to_squad: false,
    squads: [],
  };

  const metric = {
    type: 'medical',
    category: 'all_injuries',
    main_category: 'injury',
    squad_selection: squadSelection,
  };

  const permittedSquads = [
    {
      id: '1',
      name: 'Squad 1',
    },
  ];

  const props = {
    index: 0,
    squadAthletes,
    metric,
    disableTimePeriod: false,
    updateSquadSelection: jest.fn(),
    updateCategory: jest.fn(),
    updateCategoryDivision: jest.fn(),
    updateTimePeriod: jest.fn(),
    addFilter: jest.fn(),
    removeFilter: jest.fn(),
    updateTimeLossFilters: jest.fn(),
    updateSessionTypeFilters: jest.fn(),
    updateCompetitionFilters: jest.fn(),
    updateMeasurementType: jest.fn(),
    permittedSquads,
    graphGroup: 'summary_bar',
    t: i18nT,
  };

  it('renders', () => {
    render(<MedicalSection {...props} />);
    expect(screen.getByTestId('MedicalSection')).toBeInTheDocument();
  });

  it('contains a time period selector', () => {
    render(<MedicalSection {...props} />);
    expect(screen.getByText('Date Range')).toBeInTheDocument();
  });

  describe('when the graphing-offset-calc feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('graphing-offset-calc', true);
    });

    afterEach(() => {
      window.setFlag('graphing-offset-calc', false);
    });

    it('renders an last x days offset component when the time period is last_x_days', () => {
      render(<MedicalSection {...props} timePeriod="last_x_days" />);
      // label for the last time period picker
      expect(screen.getByText('Last')).toBeInTheDocument();
    });
  });

  it('contains a Category dropdown', async () => {
    render(<MedicalSection {...props} />);

    expect(screen.getByText('Category')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('GroupedDropdown|TriggerButton'));

    expect(screen.getByText('Injuries')).toBeInTheDocument();
    // the selected option shows in the input box and the dropdown
    expect(screen.getAllByText('No. of Injury Occurrences').length).toBe(2);

    // the following have options under injury section and illness section of the grouped dropdown
    expect(screen.getAllByText('Pathology').length).toBe(2);
    expect(screen.getAllByText('Body Area').length).toBe(2);
    expect(screen.getAllByText('Classification').length).toBe(2);
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Session Type')).toBeInTheDocument();
    expect(screen.getByText('Contact Type')).toBeInTheDocument();
    expect(screen.getByText('Competition')).toBeInTheDocument();

    expect(screen.getByText('Illnesses')).toBeInTheDocument();
  });

  describe('When selecting a category', () => {
    it('calls the props.updateCategory() with the metric index', async () => {
      render(<MedicalSection {...props} />);

      await userEvent.click(
        screen.getByTestId('GroupedDropdown|TriggerButton')
      );
      await userEvent.click(screen.getAllByText('Body Area')[0]);
      expect(props.updateCategory).toHaveBeenCalledWith(
        props.index,
        'body_area',
        'injury'
      );

      await userEvent.click(
        screen.getByTestId('GroupedDropdown|TriggerButton')
      );
      await userEvent.click(screen.getAllByText('Body Area')[1]);
      expect(props.updateCategory).toHaveBeenCalledWith(
        props.index,
        'body_area',
        'illness'
      );
    });
  });

  describe('When main_category is null', () => {
    const customMetric = {
      type: 'medical',
      category: 'all_injuries',
      main_category: null,
      squad_selection: squadSelection,
    };

    it('sets the Category dropdown value to null', () => {
      const { container } = render(
        <MedicalSection {...props} metric={customMetric} />
      );
      expect(
        container.querySelector(`input[name="grouped_dropdown"]`).value
      ).toBe('');
    });
  });

  describe('When category is null', () => {
    const customMetric = {
      type: 'medical',
      category: null,
      main_category: 'injury',
      squad_selection: squadSelection,
    };

    it('sets the Category dropdown value to null', () => {
      const { container } = render(
        <MedicalSection {...props} metric={customMetric} />
      );
      expect(
        container.querySelector(`input[name="grouped_dropdown"]`).value
      ).toBe('');
    });
  });

  it('renders a filter section', () => {
    render(<MedicalSection {...props} />);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });

  describe('when the graphing-diagnostics-interventions flag is on', () => {
    beforeEach(() => {
      window.setFlag('graphing-diagnostics-interventions', true);
    });

    afterEach(() => {
      window.setFlag('graphing-diagnostics-interventions', false);
    });

    it('does not render the filter section if the graphingmain category is general_medical', () => {
      const customMetric = {
        type: 'medical',
        category: 'diagnostic',
        main_category: 'general_medical',
        squad_selection: squadSelection,
      };
      render(<MedicalSection {...props} metric={customMetric} />);

      expect(
        screen.queryByRole('button', { name: 'Filter' })
      ).not.toBeInTheDocument();
    });
  });

  describe('When clicking add filter', () => {
    it('calls addFilter with the metric index', async () => {
      render(<MedicalSection {...props} />);

      await userEvent.click(screen.getByRole('button', { name: 'Filter' }));

      expect(props.addFilter).toHaveBeenCalled();
    });
  });

  it('displays an athlete selector dropdown', () => {
    render(<MedicalSection {...props} />);
    expect(screen.getByText('#sport_specific__Athletes')).toBeInTheDocument();
  });

  describe('When the graph group is summary_donut', () => {
    it('contains a Measurement Value dropdown', async () => {
      render(
        <MedicalSection
          {...props}
          metric={{
            ...props.metric,
            measurement_type: 'raw',
          }}
          graphGroup="summary_donut"
        />
      );

      // the dropdown, and the selected option
      expect(screen.getAllByText('Raw').length).toBe(2);
      expect(screen.getByText('Percentage')).toBeInTheDocument();
      expect(screen.getByText('Measurement Value')).toBeInTheDocument();
    });

    describe('When selecting a measurement type', () => {
      it('calls the props.updateMeasurementType()', async () => {
        render(
          <MedicalSection
            {...props}
            metric={{
              ...props.metric,
              measurement_type: 'raw',
            }}
            graphGroup="summary_donut"
          />
        );

        await userEvent.click(screen.getByText('Percentage'));
        expect(props.updateMeasurementType).toHaveBeenCalledWith(
          0,
          'percentage'
        );
      });
    });
  });

  describe('When the graph group is longitudinal', () => {
    it('contains a Medical Category dropdown with only global categories', async () => {
      render(<MedicalSection {...props} graphGroup="longitudinal" />);

      await userEvent.click(
        screen.getByTestId('GroupedDropdown|TriggerButton')
      );

      expect(screen.getAllByText('No. of Injury Occurrences').length).toBe(2);
      expect(
        screen.getByText('No. of Illness Occurrences')
      ).toBeInTheDocument();
    });
  });

  describe('When the graph group is summary_stack_bar', () => {
    it('contains a Category Division dropdown', () => {
      render(
        <MedicalSection
          {...props}
          graphGroup="summary_stack_bar"
          metric={{
            type: 'medical',
            main_category: 'injury',
            category: 'pathology',
            category_division: 'body_area',
            squad_selection: squadSelection,
          }}
        />
      );
      expect(screen.getByText('Category Division')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Session Type')).toBeInTheDocument();
      expect(screen.getByText('Contact Type')).toBeInTheDocument();
    });

    it('disables the Category Division dropdown when the main_category is not set', () => {
      render(
        <MedicalSection
          {...props}
          graphGroup="summary_stack_bar"
          metric={{
            type: 'medical',
            category: null,
            main_category: null,
            squad_selection: squadSelection,
          }}
        />
      );

      expect(screen.getAllByRole('button')[2]).toBeDisabled();
    });

    describe('When selecting a category division', () => {
      it('calls the props.updateCategoryDivision()', async () => {
        render(
          <MedicalSection
            {...props}
            graphGroup="summary_stack_bar"
            metric={{
              type: 'medical',
              main_category: 'injury',
              category: 'pathology',
              category_division: null,
              squad_selection: squadSelection,
            }}
          />
        );
        expect(screen.getByText('Session Type')).toBeInTheDocument();
        await userEvent.click(screen.getByText('Session Type'));
        expect(props.updateCategoryDivision).toHaveBeenCalledWith(
          0,
          'session_type'
        );
      });
    });
  });

  describe('When the graph group is value_visualisation', () => {
    const valueVisualisationMetric = {
      type: 'medical',
      category: 'all_injuries',
      main_category: 'injury',
      category_selection: null,
      squad_selection: squadSelection,
      calculation: 'count',
    };

    it('hide illnesses group dropdown category if coding system is set to `clinical_impressions`', async () => {
      const defaultOrgInfo = {
        organisation: {
          id: 1,
          name: 'Liverpool FC <3',
          coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
        },
      };
      render(
        <MockedOrganisationContextProvider organisationContext={defaultOrgInfo}>
          <MedicalSection {...props} graphGroup="value_visualisation" />
        </MockedOrganisationContextProvider>
      );
      expect(screen.getByText('Category')).toBeInTheDocument();
      await userEvent.click(
        screen.getByTestId('GroupedDropdown|TriggerButton')
      );

      expect(screen.getByText('Injuries')).toBeInTheDocument();
      expect(screen.queryByText('Illnesses')).not.toBeInTheDocument();
    });

    describe('and the graphing-diagnostics-interventions flag is on', () => {
      beforeEach(() => {
        window.setFlag('graphing-diagnostics-interventions', true);
      });

      afterEach(() => {
        window.setFlag('graphing-diagnostics-interventions', false);
      });

      it('contains a Category dropdown with general medical options', async () => {
        render(
          <MedicalSection
            {...props}
            graphGroup="value_visualisation"
            metric={valueVisualisationMetric}
          />
        );

        expect(screen.getByText('Category')).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('GroupedDropdown|TriggerButton')
        );

        expect(screen.getByText('General Medical')).toBeInTheDocument();
        expect(
          screen.getByText('Diagnostics / Interventions')
        ).toBeInTheDocument();
      });
    });

    it('contains a Calculation dropdown', () => {
      render(
        <MedicalSection
          {...props}
          graphGroup="value_visualisation"
          metric={valueVisualisationMetric}
        />
      );
      expect(screen.getByText('Calculation')).toBeInTheDocument();
    });

    describe('When the category is null', () => {
      const customMetric = {
        ...valueVisualisationMetric,
        category: null,
      };

      it("doesn't render a category selection dropdown", () => {
        render(
          <MedicalSection
            {...props}
            graphGroup="value_visualisation"
            metric={customMetric}
          />
        );
        expect(
          screen.queryByTestId('MedicalCategory|GroupedDropdown')
        ).not.toBeInTheDocument();
      });
    });

    describe('When category selection is all_injuries', () => {
      const customMetric = {
        ...valueVisualisationMetric,
        category: 'all_injuries',
      };

      it("doesn't render a category selection dropdown", () => {
        render(
          <MedicalSection
            {...props}
            graphGroup="value_visualisation"
            metric={customMetric}
          />
        );
        expect(
          screen.queryByTestId('MedicalCategory|GroupedDropdown')
        ).not.toBeInTheDocument();
      });
    });

    describe('When category selection is all_illnesses', () => {
      const customMetric = {
        ...valueVisualisationMetric,
        category: 'all_illnesses',
      };

      it("doesn't render a category selection dropdown", () => {
        render(
          <MedicalSection
            {...props}
            graphGroup="value_visualisation"
            metric={customMetric}
          />
        );
        expect(
          screen.queryByTestId('MedicalCategory|GroupedDropdown')
        ).not.toBeInTheDocument();
      });
    });

    describe('When category selection is neither all_illnesses or all_injuries', () => {
      const customMetric = {
        ...valueVisualisationMetric,
        category: 'pathology',
      };

      it('renders a category selection dropdown', () => {
        render(
          <MedicalSection
            {...props}
            graphGroup="value_visualisation"
            metric={customMetric}
            categorySelections={[]}
          />
        );
        expect(
          screen.getByTestId('MedicalCategory|GroupedDropdown')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when FF multi-coding-pipepline-graph is on, hide classifications', () => {
    beforeEach(() => {
      window.setFlag('multi-coding-pipepline-graph', true);
    });
    afterEach(() => {
      window.setFlag('multi-coding-pipepline-graph', false);
    });
    it('hide illnesses group dropdown category if coding system is set to `clinical_impressions`', async () => {
      const defaultOrgInfo = {
        organisation: {
          id: 1,
          name: 'Liverpool FC <3',
          coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
        },
      };
      render(
        <MockedOrganisationContextProvider organisationContext={defaultOrgInfo}>
          <MedicalSection {...props} />
        </MockedOrganisationContextProvider>
      );
      expect(screen.getByText('Category')).toBeInTheDocument();
      await userEvent.click(
        screen.getByTestId('GroupedDropdown|TriggerButton')
      );

      // the selected option shows in the input box and the dropdown
      expect(screen.getAllByText('No. of Injury Occurrences').length).toBe(2);

      expect(screen.getByText('Injuries')).toBeInTheDocument();
      expect(screen.getByText('Pathology')).toBeInTheDocument();
      expect(screen.getByText('Body Area')).toBeInTheDocument();
      expect(screen.getByText('Classification')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Session Type')).toBeInTheDocument();
      expect(screen.getByText('Contact Type')).toBeInTheDocument();
      expect(screen.getByText('Competition')).toBeInTheDocument();

      expect(screen.queryByText('Illnesses')).not.toBeInTheDocument();
    });
  });
});
