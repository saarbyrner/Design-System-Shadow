import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import CreateGraphForm from '..';

jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/containers/GraphForm/CommonGraphForm',
  () => {
    return function MockCommonGraphForm() {
      return <div data-testid="common-graph-form">CommonGraphForm</div>;
    };
  }
);

jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/containers/GraphForm/Summary',
  () => {
    return function MockFormSummary() {
      return <div data-testid="form-summary">FormSummary</div>;
    };
  }
);

const mockStore = {
  StaticData: {
    athletesDropdown: [],
    availableVariables: [],
  },
  GraphFormType: {},
  GraphGroup: {},
  GraphForm: {
    metrics: [],
  },
  GraphFormSummary: {
    scale_type: 'linear',
    metrics: [],
  },
  AppStatus: {},
  DashboardSelectorModal: {},
  RenameGraphModal: {},
};

describe('<CreateGraphForm />', () => {
  const defaultProps = {
    graphType: 'line',
    graphGroup: 'longitudinal',
    updateGraphFormType: jest.fn(),
    fetchCodingSystemCategories: jest.fn(),
    canAccessMedicalGraph: true,
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.setFlag('multi-coding-pipepline-graph', false);
  });

  it('renders the GraphForm', () => {
    renderWithRedux(<CreateGraphForm {...defaultProps} />, {
      preloadedState: mockStore,
      useGlobalStore: false,
    });

    expect(screen.getByText('Graph Type')).toBeInTheDocument();
  });

  it('contains a graph selector', () => {
    renderWithRedux(<CreateGraphForm {...defaultProps} />, {
      preloadedState: mockStore,
      useGlobalStore: false,
    });

    const formContainer = document.querySelector('.graphComposer__form');
    expect(formContainer).toBeInTheDocument();
  });

  describe("when the graph group is 'longitudinal'", () => {
    it('renders CommonGraphForm', () => {
      renderWithRedux(
        <CreateGraphForm
          {...defaultProps}
          graphType="radar"
          graphGroup="longitudinal"
        />,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );
      expect(screen.getByTestId('common-graph-form')).toBeInTheDocument();
    });
  });

  describe("when the graph group is 'summary_bar'", () => {
    it('renders CommonGraphForm', () => {
      renderWithRedux(
        <CreateGraphForm
          {...defaultProps}
          graphType="line"
          graphGroup="summary_bar"
        />,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(screen.getByTestId('common-graph-form')).toBeInTheDocument();
    });
  });

  describe("when the graph group is 'summary_donut'", () => {
    it('renders CommonGraphForm', () => {
      renderWithRedux(
        <CreateGraphForm
          {...defaultProps}
          graphType="donut"
          graphGroup="summary_donut"
        />,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(screen.getByTestId('common-graph-form')).toBeInTheDocument();
    });
  });

  describe("when the graph group is 'summary_stack_bar'", () => {
    it('renders CommonGraphForm', () => {
      renderWithRedux(
        <CreateGraphForm
          {...defaultProps}
          graphType="column"
          graphGroup="summary_stack_bar"
        />,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(screen.getByTestId('common-graph-form')).toBeInTheDocument();
    });
  });

  describe("when the graph group is 'value_visualisation'", () => {
    it('renders CommonGraphForm', () => {
      renderWithRedux(
        <CreateGraphForm {...defaultProps} graphGroup="value_visualisation" />,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(screen.getByTestId('common-graph-form')).toBeInTheDocument();
    });
  });

  describe("when the graph group is 'summary'", () => {
    it('renders FormSummary', () => {
      renderWithRedux(
        <CreateGraphForm
          {...defaultProps}
          graphType="radar"
          graphGroup="summary"
        />,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(screen.getByTestId('form-summary')).toBeInTheDocument();
    });
  });

  describe("when 'isEditing' is true", () => {
    it('hides the graph type selector', () => {
      renderWithRedux(
        <CreateGraphForm {...defaultProps} graphType="radar" isEditing />,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(screen.queryByText('Graph Type')).not.toBeInTheDocument();
    });
  });

  describe("when 'multi-coding-pipepline-graph' FF is on", () => {
    beforeEach(() => {
      window.setFlag('multi-coding-pipepline-graph', true);
    });
    afterEach(() => {
      window.setFlag('multi-coding-pipepline-graph', false);
    });

    it('uses the organisations coding system to fetch categories', () => {
      const orgInfo = {
        organisation: {
          id: 1,
          name: 'organisation',
          coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
        },
      };

      renderWithRedux(
        <MockedOrganisationContextProvider organisationContext={orgInfo}>
          <CreateGraphForm {...defaultProps} />
        </MockedOrganisationContextProvider>,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(defaultProps.fetchCodingSystemCategories).toHaveBeenCalledWith(
        codingSystemKeys.CLINICAL_IMPRESSIONS
      );
    });
  });

  describe("when 'multi-coding-pipepline-graph' FF is off", () => {
    beforeEach(() => {
      window.setFlag('multi-coding-pipepline-graph', false);
    });
    afterEach(() => {
      window.setFlag('multi-coding-pipepline-graph', false);
    });

    it('uses default coding system key (osics) to fetch categories', () => {
      const orgInfo = {
        organisation: {
          id: 1,
          name: 'organisation',
          coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
        },
      };

      renderWithRedux(
        <MockedOrganisationContextProvider organisationContext={orgInfo}>
          <CreateGraphForm {...defaultProps} />
        </MockedOrganisationContextProvider>,
        {
          preloadedState: mockStore,
          useGlobalStore: false,
        }
      );

      expect(defaultProps.fetchCodingSystemCategories).toHaveBeenCalledWith(
        codingSystemKeys.OSICS_10
      );
    });
  });
});
