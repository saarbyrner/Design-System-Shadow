import { expect } from 'chai';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import RowPanel from '../index';

const componentSelector = (key) => `[data-testid="RowPanel|${key}"]`;

describe('<RowPanel />', () => {
  const i18nT = i18nextTranslateStub(i18n);
  let props = {};

  beforeEach(() => {
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
    props = {
      rowId: null,
      appliedRows: [],
      availableVariables: [],
      calculation: 'mean',
      isOpen: true,
      dataSource: [{ name: 'Fatigue', key_name: 'kitman:tv|fatigue' }],
      onComparisonRowApply: sinon.spy(),
      onLongitudinalRowApply: sinon.spy(),
      onScorecardRowApply: sinon.spy(),
      selectedPopulation: [],
      squadAthletes,
      t: i18nT,
      tableType: 'COMPARISON',
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<RowPanel {...props} />);
    expect(wrapper).to.have.length(1);
  });

  it('contains a SlidingPanel component', () => {
    const wrapper = shallow(<RowPanel {...props} />);
    expect(wrapper.find('SlidingPanel').length).to.eq(1);
  });

  describe('when the table type is COMPARISON', () => {
    describe('when on step one', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<RowPanel {...props} />);
      });

      it('contains the correct SlidingPanel title', () => {
        expect(wrapper.find('SlidingPanel').props().title).to.eq(
          '#sport_specific__Athletes'
        );
      });

      it('renders an AthleteSelector component', () => {
        const AthleteSelector = wrapper.find('LoadNamespace(AthleteSelector)');

        expect(AthleteSelector.props().showDropdownButton).to.equal(false);
        expect(AthleteSelector.props().singleSelection).to.equal(true);
        expect(AthleteSelector.props().squadAthletes).to.deep.equal(
          props.squadAthletes
        );
        expect(AthleteSelector.props().selectedSquadAthletes).to.deep.equal({
          applies_to_squad: false,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
          context_squads: [],
        });
      });

      describe('the apply button when nothing is selected', () => {
        beforeEach(() => {
          wrapper = mount(<RowPanel {...props} />);
        });

        afterEach(() => {
          wrapper.unmount();
        });

        it('will not call props.onComparisonRowApply when nothing is selected and Apply is clicked', () => {
          const applyBtn = wrapper
            .find('.rowPanel__next--apply ForwardRef(TextButton)')
            .first();

          // click Apply
          applyBtn.simulate('click');

          expect(props.onComparisonRowApply.calledOnce).to.eq(false);
        });
      });

      describe('the apply button when a population is selected', () => {
        beforeEach(() => {
          wrapper = mount(
            <RowPanel
              {...props}
              selectedPopulation={[
                {
                  applies_to_squad: false,
                  position_groups: [43],
                  positions: [],
                  athletes: [],
                  all_squads: false,
                  squads: [],
                },
              ]}
            />
          );
        });

        afterEach(() => {
          wrapper.unmount();
        });

        it('calls props.onComparisonRowApply when Apply is clicked', () => {
          const applyBtn = wrapper
            .find('.rowPanel__next--apply ForwardRef(TextButton)')
            .first();

          // click Apply
          applyBtn.simulate('click');

          expect(props.onComparisonRowApply.calledOnce).to.eq(true);
        });
      });

      describe('when the table-widget-comparison-multiselect feature flag is on', () => {
        beforeEach(() => {
          window.setFlag('table-widget-comparison-multiselect', true);
        });

        afterEach(() => {
          window.setFlag('table-widget-comparison-multiselect', false);
        });

        it('has multiselect when editMode is false', () => {
          const rowPanel = shallow(<RowPanel {...props} isEditMode={false} />);
          const AthleteSelector = rowPanel.find(
            'LoadNamespace(AthleteSelector)'
          );

          expect(AthleteSelector.props().singleSelection).to.equal(false);
        });

        it('disables existing row populations', () => {
          const rowPanel = shallow(
            <RowPanel
              {...props}
              isEditMode={false}
              appliedRows={[
                {
                  id: 1,
                  population: {
                    applies_to_squad: false,
                    position_groups: [1],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                },
                {
                  id: 2,
                  population: {
                    applies_to_squad: false,
                    position_groups: [],
                    positions: [2],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                },
                {
                  id: 3,
                  population: {
                    applies_to_squad: false,
                    position_groups: [],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [3],
                  },
                },
                {
                  id: 4,
                  population: {
                    applies_to_squad: true,
                    position_groups: [],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                },
              ]}
            />
          );
          const AthleteSelector = rowPanel.find(
            'LoadNamespace(AthleteSelector)'
          );

          expect(AthleteSelector.props().disabledSquadAthletes).to.deep.equal({
            applies_to_squad: true,
            position_groups: [1],
            positions: [2],
            athletes: [],
            all_squads: false,
            squads: [3],
            context_squads: [],
          });
        });

        it('doesnt disable current rows athlete selection when it is in edit mode', () => {
          const rowPanel = shallow(
            <RowPanel
              {...props}
              isEditMode
              rowId={1}
              appliedRows={[
                {
                  id: 1,
                  population: {
                    applies_to_squad: false,
                    position_groups: [1],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                },
                {
                  id: 2,
                  population: {
                    applies_to_squad: false,
                    position_groups: [],
                    positions: [2],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                },
                {
                  id: 3,
                  population: {
                    applies_to_squad: false,
                    position_groups: [],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [3],
                  },
                },
                {
                  id: 4,
                  population: {
                    applies_to_squad: true,
                    position_groups: [],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                },
              ]}
            />
          );
          const AthleteSelector = rowPanel.find(
            'LoadNamespace(AthleteSelector)'
          );

          expect(AthleteSelector.props().disabledSquadAthletes).to.deep.equal({
            applies_to_squad: true,
            position_groups: [],
            positions: [2],
            athletes: [],
            all_squads: false,
            squads: [3],
            context_squads: [],
          });
        });
      });
    });
  });

  describe('when the table type is SCORECARD', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<RowPanel {...props} tableType="SCORECARD" />);
    });

    describe('when on step one', () => {
      it('contains the correct SlidingPanel title', () => {
        expect(wrapper.find('SlidingPanel').props().title).to.eq('Metric');
      });

      it('contains a grouped dropdown component for data source', () => {
        expect(wrapper.find('LoadNamespace(GroupedDropdown)').length).to.eq(1);
        expect(
          wrapper.find('LoadNamespace(GroupedDropdown)').props().label
        ).to.eq('Data Source');
      });

      it('does not contain a back arrow element', () => {
        expect(wrapper.find('.rowPanel__backArrow').length).to.eq(0);
      });

      it('contains a next step button with the correct text', () => {
        expect(
          wrapper.find('.rowPanel__next ForwardRef(TextButton)').length
        ).to.eq(1);
        expect(
          wrapper.find('.rowPanel__next ForwardRef(TextButton)').props().text
        ).to.eq('Calculation');
      });

      it('contains a next arrow element', () => {
        expect(wrapper.find('.rowPanel__nextArrow').length).to.eq(1);
      });
    });

    describe('when on step two', () => {
      beforeEach(() => {
        wrapper = shallow(<RowPanel {...props} tableType="SCORECARD" />);
        wrapper
          .find('.rowPanel__next ForwardRef(TextButton)')
          .props()
          .onClick();
        wrapper.update();
      });

      it('contains the correct SlidingPanel title', () => {
        expect(wrapper.find('SlidingPanel').props().title).to.eq(
          'Metric / Calculation'
        );
      });

      it('contains a calculation dropdown', () => {
        const dropdown = wrapper.find('LoadNamespace(Dropdown)');
        expect(dropdown.length).to.eq(1);
        expect(dropdown.props().label).to.eq('Calculation');
        expect(dropdown.props().items).to.deep.eq([
          {
            id: 'sum_absolute',
            title: props.t('Sum (Absolute)'),
          },
          {
            id: 'sum',
            title: props.t('Sum'),
          },
          {
            id: 'min_absolute',
            title: props.t('Min (Absolute)'),
          },
          {
            id: 'min',
            title: props.t('Min'),
          },
          {
            id: 'max_absolute',
            title: props.t('Max (Absolute)'),
          },
          {
            id: 'max',
            title: props.t('Max'),
          },
          {
            id: 'mean',
            title: props.t('Mean'),
          },
          {
            id: 'mean_absolute',
            title: props.t('Mean (Absolute)'),
          },
          {
            id: 'count',
            title: props.t('Count'),
          },
          {
            id: 'count_absolute',
            title: props.t('Count (Absolute)'),
          },
          {
            id: 'last',
            title: props.t('Last'),
          },
        ]);
      });

      it('contains a next step button with the correct text', () => {
        expect(
          wrapper.find('.rowPanel__next ForwardRef(TextButton)').length
        ).to.eq(1);
        expect(
          wrapper.find('.rowPanel__next ForwardRef(TextButton)').props().text
        ).to.eq('Apply');
      });

      it('contains a back arrow element', () => {
        expect(wrapper.find('.rowPanel__backArrow').length).to.eq(1);
      });

      it('contains a last step button with the correct text', () => {
        expect(
          wrapper.find('.rowPanel__back ForwardRef(TextButton)').length
        ).to.eq(1);
        expect(
          wrapper.find('.rowPanel__back ForwardRef(TextButton)').props().text
        ).to.eq('Metric');
      });

      it('does not contain a next arrow element', () => {
        expect(wrapper.find('.rowPanel__nextArrow').length).to.eq(0);
      });
    });

    describe('the apply button', () => {
      beforeEach(() => {
        wrapper = mount(<RowPanel {...props} tableType="SCORECARD" />);
        wrapper
          .find('.rowPanel__next ForwardRef(TextButton)')
          .props()
          .onClick();
        wrapper.update();
      });

      afterEach(() => {
        wrapper.unmount();
      });

      it('calls props.onScorecardRowApply with the selected metric details when Apply is clicked', () => {
        const applyBtn = wrapper.find(
          '.rowPanel__next--apply ForwardRef(TextButton)'
        );

        // click Apply
        applyBtn.simulate('click');

        expect(props.onScorecardRowApply.calledOnce).to.eq(true);
      });
    });
  });

  describe('when the table type is LONGITUDINAL', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<RowPanel {...props} tableType="LONGITUDINAL" />);
    });

    describe('when on step one', () => {
      it('contains the correct SlidingPanel title', () => {
        expect(wrapper.find('SlidingPanel').props().title).to.eq(
          'Session & Periods'
        );
      });

      it('contains a grouped dropdown for dates', () => {
        expect(wrapper.find('LoadNamespace(GroupedDropdown)').length).to.eq(1);
        expect(
          wrapper.find('LoadNamespace(GroupedDropdown)').props().label
        ).to.eq('Date');
      });
    });

    describe('the apply button', () => {
      it('is disabled if there is no timePeriod selected', () => {
        const applyBtn = wrapper.find(
          '.rowPanel__next--apply ForwardRef(TextButton)'
        );

        expect(applyBtn.props().isDisabled).to.eq(true);
      });

      it('calls props.onLongitudinalRowApply with the selected time scope details when Apply is clicked', () => {
        wrapper = shallow(
          <RowPanel
            {...props}
            tableType="LONGITUDINAL"
            timePeriod="this_season"
          />
        );

        const applyBtn = wrapper.find(
          '.rowPanel__next--apply ForwardRef(TextButton)'
        );

        // click Apply
        applyBtn.props().onClick();

        expect(props.onLongitudinalRowApply.calledOnce).to.eq(true);
      });
    });
  });

  describe('when the table-widget-creation-sidepanel-ui FF is active', () => {
    beforeEach(() => {
      window.setFlag('table-widget-creation-sidepanel-ui', true);
    });

    afterEach(() => {
      window.setFlag('table-widget-creation-sidepanel-ui', false);
    });

    it('renders the correct title', () => {
      const wrapper = shallow(<RowPanel {...props} />);
      const getPanel = () => wrapper.find(componentSelector('SlidingPanel'));

      expect(getPanel().props().title).to.equal('Add Row');
    });

    it('renders the correct title in edit mode', () => {
      const wrapper = shallow(<RowPanel {...props} isEditMode />);
      const getPanel = () => wrapper.find(componentSelector('SlidingPanel'));

      expect(getPanel().props().title, 'renders title for edit mode').to.equal(
        'Edit Row'
      );
    });

    it('renders the LongitudinalPanel for tableType LONGITUDINAL', () => {
      const wrapper = shallow(<RowPanel {...props} tableType="LONGITUDINAL" />);
      const longitudinalPanel = wrapper.find(
        componentSelector('LongitudinalPanel')
      );

      expect(longitudinalPanel).to.have.length(1);
    });

    it('renders the ScorecardPanel for tableType SCORECARD', () => {
      const wrapper = shallow(<RowPanel {...props} tableType="SCORECARD" />);
      const scorecardPanel = wrapper.find(componentSelector('ScorecardPanel'));

      expect(scorecardPanel).to.have.length(1);
    });

    describe('when the graph-squad-selector feature flag is true', () => {
      beforeEach(() => {
        window.setFlag('graph-squad-selector', true);
      });

      afterEach(() => {
        window.setFlag('graph-squad-selector', false);
      });

      it('renders the ComparisonPanel', () => {
        const wrapper = shallow(<RowPanel {...props} tableType="COMPARISON" />);
        const longitudinalPanel = wrapper.find(
          componentSelector('ComparisonPanel')
        );

        expect(longitudinalPanel).to.have.length(1);
      });
    });
  });
});
