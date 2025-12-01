import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { server, rest } from '@kitman/services/src/mocks/server';
import { data as mockedDevelopmentGoalTypes } from '@kitman/modules/src/PlanningHub/src/services/mocks/handlers/getDevelopmentGoalTypes';
import { data as mockedDashboardData } from '@kitman/services/src/mocks/handlers/analysis/getDashboards';
import { data as mockedStaff } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { data as mockedPrinciples } from '@kitman/services/src/mocks/handlers/planningHub/getPrinciples';
import Toasts from '@kitman/modules/src/Toasts';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT } from '@kitman/services/src/services/assessmentGroup/getAssessmentGroups';
import data from '@kitman/modules/src/AthleteReviews/src/shared/services/mocks/data/athlete_reviews';
import { GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT } from '@kitman/services/src/services/developmentGoalStandardNames/getDevelopmentGoalStandardNames';
import AthleteReviewForm from '..';

jest.mock('@kitman/common/src/hooks/useLocationPathname');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const localState = {
  globalApi: {
    queries: {
      'getActiveSquad(undefined)': {
        data: {
          id: 1,
        },
      },
    },
  },
};
beforeEach(() => {
  useLocationPathname.mockReturnValue('/athletes/123/athlete_reviews/new');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AthleteReviewForm', () => {
  it('renders header', async () => {
    renderWithProviders(<AthleteReviewForm />);
    expect(
      screen.getByRole('heading', { level: 5, name: 'New review' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Athlete reviews' })
    ).toHaveAttribute('href', '/athletes/123/athlete_reviews');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders review setup', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthleteReviewForm />);

    window.featureFlags = {
      'athlete-profile-goals-and-reviews': true,
    };

    expect(
      screen.getByRole('heading', { level: 6, name: 'Review setup' })
    ).toBeInTheDocument();

    const selfAssessment = screen.getByRole('combobox', {
      name: 'Self Assessment',
    });
    const selfAssessmentValue = 'Assessment Group';
    await user.click(selfAssessment);
    await user.click(
      screen.getByRole('option', {
        name: selfAssessmentValue,
      })
    );
    expect(selfAssessment).toHaveValue(selfAssessmentValue);

    const reviewType = screen.getByRole('combobox', {
      name: 'Review Type (required)',
    });
    const reviewTypeValue = 'Test Review';

    await user.click(reviewType);
    await user.click(
      screen.getByRole('option', {
        name: reviewTypeValue,
      })
    );
    expect(reviewType).toHaveValue(reviewTypeValue);

    const staffSelect = screen.getByRole('combobox', {
      name: 'Staff (required)',
    });
    await user.click(staffSelect);
    await user.click(
      screen.getByRole('option', { name: mockedStaff[0].fullname })
    );
    expect(
      screen.getByRole('button', {
        name: mockedStaff[0].fullname,
      })
    ).toBeInTheDocument();

    const descriptionValue = 'Review description';
    const reviewDescription = screen.getByRole('textbox', {
      name: 'Description (Optional)',
    });
    fireEvent.change(reviewDescription, {
      target: { value: descriptionValue },
    });
    expect(reviewDescription).toHaveValue(descriptionValue);

    const noteValue = 'Review note';
    const reviewNote = screen.getByRole('textbox', {
      name: 'Note (Optional)',
    });
    fireEvent.change(reviewNote, { target: { value: noteValue } });
    expect(reviewNote).toHaveValue(noteValue);
  });

  describe('Renders development goal 1', () => {
    it('renders the fields goal, principle and type', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AthleteReviewForm />);

      // -- DEVELOPMENT GOALS 1 SECTION --
      expect(
        screen.getByRole('heading', { level: 6, name: 'Goal 1' })
      ).toBeInTheDocument();

      const goalValue = 'Shots Off Target';
      const goalField = screen.getByRole('combobox', {
        name: 'Goal (required)',
      });
      await user.click(goalField);
      await user.click(screen.getByRole('option', { name: goalValue }));
      expect(goalField).toHaveValue(goalValue);

      // Principle Select
      const principleSelect = screen.getByRole('combobox', {
        name: 'Principle',
      });
      await user.click(principleSelect);
      await user.click(
        screen.getByRole('option', {
          name: mockedPrinciples[0].name,
          hidden: true,
        })
      );
      expect(principleSelect).toHaveValue(mockedPrinciples[0].name);

      // Type Select
      const typeSelect = screen.getByRole('combobox', {
        name: 'Type (required)',
      });
      await user.click(typeSelect);
      await user.click(
        screen.getByRole('option', {
          name: mockedDevelopmentGoalTypes[0].name,
        })
      );
      expect(typeSelect).toHaveValue(mockedDevelopmentGoalTypes[0].name);
    });

    it('renders the fields description, link to measurement and URL links', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AthleteReviewForm />, {
        preloadedState: localState,
      });

      const goalDescriptionValue = 'D';
      const goalDescription = screen.getByRole('textbox', {
        name: 'Description (required)',
      });
      fireEvent.change(goalDescription, {
        target: { value: goalDescriptionValue },
      });
      expect(goalDescription).toHaveValue(goalDescriptionValue);

      // Link to measurement select
      const linkToMeasurement = screen.getByRole('combobox', {
        name: 'Link to measurement',
      });
      await user.click(linkToMeasurement);
      await user.click(
        screen.getByRole('option', {
          name: mockedDashboardData[0].name,
        })
      );

      expect(
        screen.getByRole('button', {
          name: mockedDashboardData[0].name,
        })
      ).toBeInTheDocument();

      // URLs
      const urlLink = screen.getByRole('textbox', {
        name: 'URL link',
      });
      const urlLinkValue = 'www.my-goal-url.com';
      const urlTitle = screen.getByRole('textbox', {
        name: 'Title',
      });
      const urlTitleValue = 'G';
      fireEvent.change(urlLink, { target: { value: urlLinkValue } });
      fireEvent.change(urlTitle, { target: { value: urlTitleValue } });

      expect(screen.getByLabelText('Add URL')).toBeInTheDocument();
      // Add goal button
      expect(
        screen.getByRole('button', { name: 'Add goal' })
      ).toBeInTheDocument();
    });
  });

  describe('"Self Assessment" modal', () => {
    const openModal = async (user) => {
      await user.click(
        screen.getByRole('combobox', {
          name: 'Self Assessment',
          hidden: true,
        })
      );
      await user.click(
        screen.getByRole('button', {
          name: 'Create Assessment',
        })
      );
    };
    it('renders the create assessment button in the "Self Assessment" combo-box which open the create self assessment modal', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AthleteReviewForm />);
      await openModal(user);

      expect(
        screen.getByRole('heading', {
          name: 'New Self Assessment',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText('Do you want to create a self assessment now?')
      ).toBeInTheDocument();

      const assessmentField = screen.getByRole('combobox', {
        name: 'Assessment (required)',
      });
      expect(assessmentField).toBeInTheDocument();

      expect(
        screen.getByRole('textbox', {
          name: 'Assessment title (required)',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('textbox', {
          name: 'Assessment date (required)',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', {
          name: 'Cancel',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', {
          name: 'Create',
        })
      ).toBeInTheDocument();
    });
  });
});

describe('AthleteReviewForm - EDIT', () => {
  const athleteId = '123';
  const reviewId = '456';
  beforeEach(() => {
    useLocationPathname.mockReturnValue(
      `/athletes/${athleteId}/athlete_reviews/${reviewId}/edit`
    );
  });

  it('fetches the review and prefill the form', async () => {
    renderWithProviders(<AthleteReviewForm />);

    await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

    // review setup
    expect(screen.getByDisplayValue('Assessment Group')).toBeInTheDocument(); // self assessment
    expect(screen.getByDisplayValue('Test Review')).toBeInTheDocument(); // Review Type
    expect(
      screen.getByRole('button', {
        name: "Stuart O'Brien",
      })
    ).toBeInTheDocument(); // staff field
    expect(screen.getByDisplayValue('01/31/2024')).toBeInTheDocument(); // start date
    expect(screen.getByDisplayValue('10/27/2024')).toBeInTheDocument(); // end date
    expect(
      screen.getByDisplayValue('A review description') // description
    ).toBeInTheDocument();

    // Goal 1
    expect(screen.getByDisplayValue('Goal 1 Name')).toBeInTheDocument(); // start date
    expect(
      screen.getByDisplayValue('First development goal type') // goal type
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Long pass') // principle type
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Goal 1 description') // Goal 1 description
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Dashboard 1',
      })
    ).toBeInTheDocument(); // Link to measurement
    expect(
      screen.getByDisplayValue(
        'https://github.com/KitmanLabs/kitman-frontend/pull/6211/files'
      ) // URL link
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Lampard highlights') // URL title
    ).toBeInTheDocument();
  });

  // due to a timeout issue of adding 10 goals and adding 5 links we have tested this with it prefilled in the 'EDIT'
  describe.skip('Goal/URL limits', () => {
    beforeEach(() => {
      const fiveUrlLinks = [...new Array(5)].map((currentElement, index) => ({
        id: index + 1,
        uri: 'https://github.com/',
        title: 'github',
      }));
      const tenDevGoals = [...new Array(10)].map((currentElement, index) => ({
        ...data[0].development_goals[0],
        id: index + 1,
        attached_links: fiveUrlLinks,
      }));

      server.use(
        rest.get(
          `/athletes/${athleteId}/athlete_reviews/${reviewId}`,
          (req, res, ctx) =>
            res(
              ctx.json({
                event: { ...data[0], development_goals: tenDevGoals },
              })
            )
        )
      );
    });

    it('user is able to add 10 goals and the add button reappears when one is deleted', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AthleteReviewForm />);

      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));
      expect(
        screen.queryByRole('button', { name: 'Add goal' })
      ).not.toBeInTheDocument();

      // should have the headings 'New review' 'Review Setup' and 'Goal 1' to 'Goal 10'
      const headers = screen.getAllByRole('heading');
      expect(headers).toHaveLength(12);

      // first 5 delete buttons are the URL links delete btn
      await user.click(screen.getAllByTestId('DeleteOutlineIcon')[5]);

      expect(
        screen.getByRole('button', { name: 'Add goal' })
      ).toBeInTheDocument();
    });

    it('user is able to add up to 5 urls to a goal and the add button reappears when one is deleted', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AthleteReviewForm />);

      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));
      expect(
        screen.queryByRole('button', { name: 'Add URL' })
      ).not.toBeInTheDocument();

      await user.click(screen.getAllByTestId('DeleteOutlineIcon')[0]);

      expect(
        screen.getByRole('button', { name: 'Add URL' })
      ).toBeInTheDocument();
    });
  });
});

describe('AthleteReviewForm - Development Goal Field', () => {
  const athleteId = '123';
  const reviewId = '456';
  beforeEach(() => {
    useLocationPathname.mockReturnValue(
      `/athletes/${athleteId}/athlete_reviews/${reviewId}/edit`
    );
  });

  const listOption = 'Shots On Target';
  it('renders the pre-select list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AthleteReviewForm />);
    await waitForElementToBeRemoved(screen.queryByText('Loading ...'));
    const goalField = screen.getByRole('combobox', {
      name: 'Goal (required)',
    });
    await user.click(goalField);
    expect(
      screen.getByRole('option', { name: listOption })
    ).toBeInTheDocument();
  });

  it('displays selected value from the pre-select list over typed arbitrary value', async () => {
    server.use(
      rest.get(
        '/athletes/:athleteId/athlete_reviews/:reviewId',
        (req, res, ctx) =>
          res(
            ctx.json({
              event: {
                ...data[0],
                development_goals: [
                  {
                    ...data[0].development_goals[0],
                    development_goal_standard_name_id: 3,
                    additional_name: 'This shouldnt display',
                  },
                ],
              },
            })
          )
      )
    );
    renderWithProviders(<AthleteReviewForm />);
    await waitForElementToBeRemoved(screen.queryByText('Loading ...'));
    expect(
      screen.getByRole('combobox', { name: 'Goal (required)' })
    ).toHaveValue(listOption);
  });

  it('displays the typed arbitrary value if none pre-selected from the list', async () => {
    const additionalName = 'This should display';
    server.use(
      rest.get(
        '/athletes/:athleteId/athlete_reviews/:reviewId',
        (req, res, ctx) =>
          res(
            ctx.json({
              event: {
                ...data[0],
                development_goals: [
                  {
                    ...data[0].development_goals[0],
                    additional_name: additionalName,
                  },
                ],
              },
            })
          )
      )
    );
    renderWithProviders(<AthleteReviewForm />);
    await waitForElementToBeRemoved(screen.queryByText('Loading ...'));
    expect(
      screen.getByRole('combobox', { name: 'Goal (required)' })
    ).toHaveValue(additionalName);
  });
});

describe('AthleteReviewForm - toast messages', () => {
  const addFieldToAllMandatoryFieldsExceptStartDate = async (user) => {
    await user.click(screen.getByLabelText('Review Type (required)'));
    await user.click(
      screen.getByRole('option', {
        name: 'Test Review',
      })
    );
    await user.click(screen.getByLabelText('Type (required)'));
    await user.click(
      screen.getByRole('option', {
        name: 'Second development goal type',
      })
    );
    fireEvent.change(
      screen.getByRole('combobox', {
        name: 'Goal (required)',
      }),
      { target: { value: 'G' } }
    );
    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'Description (required)',
      }),
      { target: { value: 'D' } }
    );

    const staffSelect = screen.getByRole('combobox', {
      name: 'Staff (required)',
    });
    await user.click(staffSelect);
    await user.click(
      screen.getByRole('option', { name: mockedStaff[0].fullname })
    );
  };

  const addFieldToAllMandatoryFields = async (user) => {
    await addFieldToAllMandatoryFieldsExceptStartDate(user);
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Start date (required)' }),
      { target: { value: '02/11/2003' } }
    );
  };
  it('saves the review request successfully', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <Toasts />
        <AthleteReviewForm />
      </>,
      {
        container: document.body,
      }
    );
    await addFieldToAllMandatoryFields(user);
    // -- SAVE FORM --
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Review saved')).toBeInTheDocument();
  });

  it('shows an error message when the review request fails', async () => {
    server.use(
      rest.post('/athletes/:athleteId/athlete_reviews', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <Toasts />
        <AthleteReviewForm />
      </>,
      {
        container: document.body,
      }
    );
    await addFieldToAllMandatoryFields(user);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Error saving review')).toBeInTheDocument();
  });

  describe('handles field validation', () => {
    it('shows the correct error message when required fields are empty', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <>
          <Toasts />
          <AthleteReviewForm />
        </>,
        {
          container: document.body,
        }
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(
        screen.getByRole('heading', {
          name: 'Required field not complete',
        })
      ).toBeInTheDocument();
    });

    it('shows the correct error message when start date is ahead of the end date', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <>
          <Toasts />
          <AthleteReviewForm />
        </>,
        {
          container: document.body,
        }
      );

      await addFieldToAllMandatoryFieldsExceptStartDate(user);
      fireEvent.change(screen.getByRole('textbox', { name: 'End date' }), {
        target: { value: '02/11/2002' },
      });

      fireEvent.change(
        screen.getByRole('textbox', { name: 'Start date (required)' }),
        { target: { value: '02/11/2003' } }
      );
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(
        screen.getByRole('heading', {
          name: 'Start date must be before end date',
        })
      ).toBeInTheDocument();
    });

    it(
      'shows the correct error message when there is an invalid date entered',
      async () => {
        const user = userEvent.setup();

        renderWithProviders(
          <>
            <Toasts />
            <AthleteReviewForm />
          </>,
          {
            container: document.body,
          }
        );

        await addFieldToAllMandatoryFieldsExceptStartDate(user);

        await user.type(
          screen.getByRole('textbox', { name: 'End date' }),
          '0212'
        );

        await user.type(
          screen.getByRole('textbox', { name: 'Start date (required)' }),
          '02/11/2003'
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(
          screen.getByRole('heading', {
            name: 'Invalid date entered',
          })
        ).toBeInTheDocument();
      },
      // TODO: remove the custom timeout and replace user.type with something.
      30 * 1000
    );
  });
});

describe('AthleteReviewForm - error handling', () => {
  it('shows an error message when the development goals request fails', async () => {
    server.use(
      rest.get(
        '/ui/planning_hub/development_goal_types?current_squad=true',
        (req, res, ctx) => res(ctx.status(500))
      )
    );

    renderWithProviders(<AthleteReviewForm />);

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('shows an error message when getting the pre-select list for "Goal" fails', async () => {
    server.use(
      rest.get(
        GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT,
        (req, res, ctx) => res(ctx.status(500))
      )
    );

    renderWithProviders(<AthleteReviewForm />);

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('shows an error message when the principles request fails', async () => {
    server.use(
      rest.post('/ui/planning_hub/principles/search', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    renderWithProviders(<AthleteReviewForm />);

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('shows an error message when the staff user request fails', async () => {
    server.use(
      rest.get('/users/staff_only', (req, res, ctx) => res(ctx.status(500)))
    );

    renderWithProviders(<AthleteReviewForm />);

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('shows an error message when the review types request fails', async () => {
    server.use(
      rest.get(
        '/athletes/athlete_reviews/find_athlete_review_types',
        (req, res, ctx) => res(ctx.status(500))
      )
    );

    renderWithProviders(<AthleteReviewForm />);

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('shows an error message when the athlete assessment group fails', async () => {
    server.use(
      rest.post(GENERIC_GET_ASSESSMENT_GROUPS_ENDPOINT, (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    renderWithProviders(<AthleteReviewForm />);

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  it('shows an error message when the dashboard request fails', async () => {
    server.use(
      rest.get('/ui/squads/:id/dashboards', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    renderWithProviders(<AthleteReviewForm />, {
      preloadedState: localState,
    });

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });
});
