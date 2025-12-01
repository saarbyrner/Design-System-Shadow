import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import OrgCustomFields from '../common/OrgCustomFields';

describe('<OrgCustomFields />', () => {
  const testEvent = {
    type: 'session_event',
    nfl_location_id: 1,
    season_type_id: 1,
    nfl_surface_type_id: 2,
    nfl_equipment_id: 1,
    nfl_surface_composition_id: 37,
    field_condition: 2,
    temperature: 30,
    humidity: 15,
  };

  const simpleValidResult = {
    isInvalid: false,
  };

  const simpleInvalidResult = {
    isInvalid: true,
  };

  const testValidity = {
    nfl_location_id: simpleValidResult,
    season_type_id: simpleValidResult,
    nfl_surface_type_id: simpleValidResult,
    nfl_equipment_id: simpleValidResult,
    field_condition: simpleValidResult,
    temperature: simpleValidResult,
    humidity: simpleValidResult,
  };

  const props = {
    event: testEvent,
    eventValidity: testValidity,
    onUpdateEventDetails: jest.fn(),
    onUpdateEventTitle: jest.fn(),
    t: (key) => key,
  };

  it('renders the session fields correctly', async () => {
    render(<OrgCustomFields {...props} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Location')).toBeInTheDocument();
    });
    expect(screen.getByText('Venue 1')).toBeInTheDocument();

    expect(screen.getByLabelText('Season type')).toBeInTheDocument();
    expect(screen.getByText('Season Type 1')).toBeInTheDocument();

    expect(screen.getByLabelText('Surface type')).toBeInTheDocument();
    expect(screen.getByText('Surface 2')).toBeInTheDocument();

    expect(screen.getByLabelText('Equipment')).toBeInTheDocument();
    expect(screen.getByText('Equipment 1')).toBeInTheDocument();

    expect(screen.getByLabelText('Field Condition')).toBeInTheDocument();
    expect(screen.getByText('Field Condition 2')).toBeInTheDocument();

    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
  });

  describe('onUpdateEventDetails is called correctly', () => {
    it('updates the default surface type when location is updated', async () => {
      render(<OrgCustomFields {...props} />);
      await waitFor(() =>
        expect(screen.getByText('Venue 1')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Venue 1'));
      await waitFor(() =>
        expect(screen.getByText('Venue 2')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Venue 2'));

      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          nfl_location_id: 2,
          nfl_surface_type_id: 3,
        })
      );
    });

    it('season type', async () => {
      render(<OrgCustomFields {...props} />);
      await waitFor(() =>
        expect(screen.getByText('Season Type 1')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Season Type 1'));
      await waitFor(() =>
        expect(screen.getByText('Season Type 2')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Season Type 2'));

      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          season_type_id: 2,
          season_type: {
            is_archived: false,
            label: 'Season Type 2',
            value: 2,
            id: 2,
            name: 'Season Type 2',
          },
        })
      );
    });

    it('surface type', async () => {
      render(<OrgCustomFields {...props} />);
      await waitFor(() =>
        expect(screen.getByText('Surface 2')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Surface 2'));
      await waitFor(() =>
        expect(screen.getByText('Surface 1')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Surface 1'));

      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          nfl_surface_type_id: 1,
        })
      );
    });

    it('equipment type', async () => {
      render(<OrgCustomFields {...props} />);
      await waitFor(() =>
        expect(screen.getByText('Equipment 1')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Equipment 1'));
      await waitFor(() =>
        expect(screen.getByText('Equipment 2')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Equipment 2'));

      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          nfl_equipment_id: 2,
        })
      );
    });

    it('field condition', async () => {
      render(<OrgCustomFields {...props} />);
      await waitFor(() =>
        expect(screen.getByText('Field Condition 2')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Field Condition 2'));
      await waitFor(() =>
        expect(screen.getByText('Field Condition 1')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Field Condition 1'));

      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          field_condition: 1,
        })
      );
    });

    it('surface composition', async () => {
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          <OrgCustomFields {...props} />
        </VirtuosoMockContext.Provider>
      );

      await waitFor(() =>
        expect(screen.getByText('Surface Comp 1')).toBeInTheDocument()
      );
      const selectLabel = screen.getByText('Surface Comp 1');
      selectEvent.openMenu(selectLabel);

      await waitFor(() =>
        expect(screen.getByText('Surface Comp 2')).toBeInTheDocument()
      );
      await userEvent.click(screen.getByText('Surface Comp 2'));

      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          nfl_surface_composition_id: 40,
          nfl_surface_composition: { value: 40, label: 'Surface Comp 2' },
        })
      );
    });

    it('set temperature and humidity', async () => {
      render(<OrgCustomFields {...props} />);
      await waitFor(() => {
        expect(screen.getByText('Temperature')).toBeInTheDocument();
        expect(screen.getByText('Humidity')).toBeInTheDocument();
      });

      const tempField = screen.getByDisplayValue(30);
      fireEvent.change(tempField, { target: { value: 70 } });
      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          temperature: '70',
        })
      );

      const humidityField = screen.getByDisplayValue(15);
      fireEvent.change(humidityField, { target: { value: 10 } });
      await waitFor(() =>
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          humidity: '10',
        })
      );
    });
  });

  it('correctly shows invalid class', async () => {
    const testInValidity = {
      nfl_location_id: simpleInvalidResult,
      season_type_id: simpleInvalidResult,
      nfl_surface_type_id: simpleInvalidResult,
      nfl_equipment_id: simpleInvalidResult,
      field_condition: simpleInvalidResult,
      temperature: simpleInvalidResult,
      humidity: simpleInvalidResult,
    };
    const invalidProps = {
      event: testEvent,
      eventValidity: testInValidity,
      onUpdateEventDetails: jest.fn(),
      onUpdateEventTitle: jest.fn(),
      t: (key) => key,
    };

    const { container } = render(<OrgCustomFields {...invalidProps} />);
    await waitFor(() => {
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    // 5 invalid select components
    expect(
      container.getElementsByClassName('kitmanReactSelect--invalid').length
    ).toEqual(5);

    // 2 invalid numeric components
    expect(
      container.getElementsByClassName('InputNumeric__inputContainer--invalid')
        .length
    ).toEqual(2);
  });

  describe('when planning-custom-org-event-details is on', () => {
    beforeEach(() => {
      window.setFlag('planning-custom-org-event-details', true);
    });
    afterEach(() => {
      window.setFlag('planning-custom-org-event-details', false);
    });

    const newEvent = {
      type: 'session_event',
    };

    const newEventProps = {
      event: newEvent,
      eventValidity: testValidity,
      onUpdateEventDetails: jest.fn(),
      onUpdateEventTitle: jest.fn(),
      t: (key) => key,
    };
    it('hides archived season types when creating a new session', async () => {
      render(<OrgCustomFields {...newEventProps} />);
      await waitFor(() => {
        expect(screen.getByLabelText('Season type')).toBeInTheDocument();
      });
      const seasonTypeSelect = screen.getAllByRole('textbox')[0];
      await userEvent.click(seasonTypeSelect);
      await waitFor(() => {
        expect(screen.getByText('Season Type 1')).toBeInTheDocument();
        expect(screen.getByText('Season Type 2')).toBeInTheDocument();
        expect(
          screen.queryByText('Archived Season Type')
        ).not.toBeInTheDocument();
      });
    });

    it('hides archived season types when editing a session that does not have an archived season type', async () => {
      const nonArchivedType = {
        type: 'session_event',
        season_type: { id: 2, name: 'Season Type 2', is_archived: false },
        season_type_id: 2,
      };

      const nonArchivedProps = {
        ...newEventProps,
        event: nonArchivedType,
      };
      render(<OrgCustomFields {...nonArchivedProps} />);
      await waitFor(() => {
        expect(screen.getByLabelText('Season type')).toBeInTheDocument();
      });
      const seasonTypeSelect = screen.getAllByRole('textbox')[0];
      await userEvent.click(seasonTypeSelect);
      await waitFor(() => {
        expect(screen.getByText('Season Type 1')).toBeInTheDocument();
        expect(
          screen.queryByText('Archived Season Type')
        ).not.toBeInTheDocument();

        // this is the selected option in the input box and dropdown
        expect(screen.getAllByText('Season Type 2').length).toEqual(2);
      });
    });

    it('shows archived season type when editing a session that has an archived season type', async () => {
      const archivedType = {
        type: 'session_event',
        season_type: { id: 3, name: 'Archived Season Type', is_archived: true },
        season_type_id: 3,
      };

      const archivedProps = {
        ...newEventProps,
        event: archivedType,
      };
      render(<OrgCustomFields {...archivedProps} />);
      await waitFor(() => {
        expect(screen.getByText('Archived Season Type')).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText('Archived Season Type'));
      await waitFor(() => {
        expect(screen.getByText('Season Type 1')).toBeInTheDocument();
        expect(screen.getByText('Season Type 2')).toBeInTheDocument();

        // this is the selected option in the input box and dropdown
        expect(screen.getAllByText('Archived Season Type').length).toEqual(2);
      });
    });

    describe('when nfl-location-feed FF is on', () => {
      beforeEach(() => {
        window.featureFlags['nfl-location-feed'] = true;
      });
      afterEach(() => {
        window.featureFlags['nfl-location-feed'] = false;
      });

      it('filters out inactive locations', async () => {
        render(<OrgCustomFields {...newEventProps} />);
        await waitFor(() => {
          expect(screen.getByLabelText('Location')).toBeInTheDocument();
        });
        const locationFeedSelect = screen.getAllByRole('textbox')[5];
        await userEvent.click(locationFeedSelect);
        await waitFor(() => {
          expect(screen.getByText('Venue 1')).toBeInTheDocument();
          expect(screen.getByText('Venue 2')).toBeInTheDocument();

          expect(
            screen.queryByText('Location Test 1 (Inactive)')
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText('Location Test 2 (Inactive)')
          ).not.toBeInTheDocument();
        });
      });

      it('sets surface type if one is linked with location', async () => {
        render(<OrgCustomFields {...newEventProps} />);
        await waitFor(() => {
          expect(screen.getByLabelText('Location')).toBeInTheDocument();
        });
        await userEvent.click(
          screen.getByRole('textbox', { name: 'Location' })
        );
        await userEvent.click(screen.getByText('Venue 1'));
        await waitFor(() =>
          expect(newEventProps.onUpdateEventDetails).toHaveBeenCalledWith({
            nfl_location_feed: {
              label: 'Venue 1',
              value: 1,
            },
            nfl_location_feed_id: 1,
            nfl_surface_composition: {
              label: 'Surface 1',
              value: 1,
            },
            nfl_surface_composition_id: 1,
          })
        );
      });

      it('clears surface composition if one is not linked with location', async () => {
        render(
          <OrgCustomFields
            {...newEventProps}
            // Add an existing nfl_surface_composition_id
            event={{ ...newEventProps.event, nfl_surface_composition_id: 1 }}
          />
        );
        await waitFor(() => {
          expect(screen.getByLabelText('Location')).toBeInTheDocument();
        });
        await userEvent.click(
          screen.getByRole('textbox', { name: 'Location' })
        );
        await userEvent.click(screen.getByText('Venue X'));
        await waitFor(() =>
          expect(newEventProps.onUpdateEventDetails).toHaveBeenCalledWith({
            nfl_location_feed: {
              label: 'Venue X',
              value: 100,
            },
            nfl_location_feed_id: 100,
            nfl_surface_composition: null,
            nfl_surface_composition_id: null,
          })
        );
      });

      it('puts current org locations first', async () => {
        const { container } = render(<OrgCustomFields {...newEventProps} />);
        await waitFor(() => {
          expect(screen.getByLabelText('Location')).toBeInTheDocument();
        });
        const locationFeedSelect = screen.getAllByRole('textbox')[5];
        await userEvent.click(locationFeedSelect);

        await waitFor(() => {
          expect(screen.getByText('Venue 1')).toBeInTheDocument();

          const groupLabels = container.getElementsByClassName(
            'kitmanReactSelect__groupHeadingLabel'
          );

          expect(groupLabels.length).toBe(2);

          expect(groupLabels[0]).toHaveTextContent('My Org');
          expect(groupLabels[1]).toHaveTextContent('Other 2');
        });
      });

      it('shows inactive location when editing a session that has an inactive location', async () => {
        const archivedType = {
          type: 'session_event',
          nfl_location_feed: {
            id: 3,
            name: 'Location Test 1',
            is_active: false,
            is_owned_by_org: true,
            organisation_name: 'My Org',
          },
          nfl_location_feed_id: 3,
        };

        const archivedProps = {
          ...newEventProps,
          event: archivedType,
        };
        render(<OrgCustomFields {...archivedProps} />);
        await waitFor(() => {
          expect(
            screen.getByText('Location Test 1 (Inactive)')
          ).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText('Location Test 1 (Inactive)'));
        await waitFor(() => {
          expect(screen.getByText('Venue 1')).toBeInTheDocument();
          expect(screen.getByText('Venue 2')).toBeInTheDocument();

          // this is the selected option in the input box and dropdown
          expect(
            screen.getAllByText('Location Test 1 (Inactive)').length
          ).toEqual(2);

          // an inactive location that is not selected should not be viewable
          expect(
            screen.queryByText('Location Test 2 (Inactive)')
          ).not.toBeInTheDocument();
        });
      });
    });
    describe('when nfl-hide-surface-type FF is on', () => {
      beforeEach(() => {
        window.setFlag('nfl-hide-surface-type', true);
      });
      afterEach(() => {
        window.setFlag('nfl-hide-surface-type', false);
      });
      it('displays the correct amount of fields', async () => {
        render(<OrgCustomFields {...props} />);
        await waitFor(() => {
          expect(screen.getByLabelText('Location')).toBeInTheDocument();
        });
        const textBoxes = screen.getAllByRole('textbox');
        expect(textBoxes).toHaveLength(5);
        expect(screen.getByText('Surface type')).toBeInTheDocument();
        expect(
          screen.queryByText('Field Type - Surface Composition')
        ).not.toBeInTheDocument();
      });
    });

    describe('when nfl-location-feed FF and when nfl-hide-surface-type FF is on are on', () => {
      beforeEach(() => {
        window.featureFlags['nfl-location-feed'] = true;
        window.setFlag('nfl-hide-surface-type', true);
      });
      afterEach(() => {
        window.featureFlags['nfl-location-feed'] = false;
        window.setFlag('nfl-hide-surface-type', false);
      });

      it('clears surface composition if one is not linked with location', async () => {
        render(
          <OrgCustomFields
            {...newEventProps}
            // Add an existing nfl_surface_composition_id
            event={{ ...newEventProps.event, nfl_surface_composition_id: 1 }}
          />
        );
        await waitFor(() => {
          expect(screen.getByLabelText('Location')).toBeInTheDocument();
        });
        await userEvent.click(
          screen.getByRole('textbox', { name: 'Location' })
        );
        await userEvent.click(screen.getByText('Venue X'));
        await waitFor(() =>
          expect(newEventProps.onUpdateEventDetails).toHaveBeenCalledWith({
            nfl_location_feed: {
              label: 'Venue X',
              value: 100,
            },
            nfl_location_feed_id: 100,
            nfl_surface_composition: null,
            nfl_surface_composition_id: null,
          })
        );
      });
    });
  });
});
