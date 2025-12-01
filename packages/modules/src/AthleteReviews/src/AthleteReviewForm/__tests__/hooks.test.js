import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import searchReviewList from '@kitman/modules/src/AthleteReviews/src/shared/services/searchReviewList';
import { useReviewFormData, useLastReviewNote } from '../hooks';
import { getDefaultReviewForm } from '../../shared/utils';

jest.mock(
  '@kitman/modules/src/AthleteReviews/src/shared/services/searchReviewList'
);

describe('hooks', () => {
  const { act } = TestRenderer;
  const defaultForm = getDefaultReviewForm();
  const defaultGoal = { ...defaultForm.development_goals[0] };
  const defaultAttachedLink = {
    ...defaultForm.development_goals[0].attached_links[0],
  };
  let result;

  beforeEach(() => {
    result = renderHook(() => useReviewFormData()).result;
  });

  afterEach(() => {
    result = null;
  });

  it('returns the initial data correctly', () => {
    expect(result.current.form).toEqual(defaultForm);
  });

  it('updates a form correctly', () => {
    const newReviewDescription = 'This Is The New Value';
    act(() => {
      result.current.updateForm('review_description', newReviewDescription);
    });

    expect(result.current.form).toEqual({
      ...defaultForm,
      review_description: newReviewDescription,
    });
  });

  it('updates an athlete goal in the form correctly', () => {
    const newGoalDescription = 'This Is The New Value';
    act(() => {
      result.current.onUpdateGoal(0, 'description', newGoalDescription);
    });
    expect(result.current.form).toEqual({
      ...defaultForm,
      development_goals: [
        {
          ...defaultGoal,
          description: newGoalDescription,
        },
      ],
    });
  });

  it('adds an athlete goal in the form correctly', () => {
    act(() => {
      result.current.onAddGoal();
    });
    expect(result.current.form).toEqual({
      ...result.current.form,
      development_goals: [
        {
          ...defaultGoal,
        },
        {
          ...defaultGoal,
        },
      ],
    });
  });

  it('removes an athlete goal in the form correctly', () => {
    // add goal first as there should always be one
    act(() => {
      result.current.onAddGoal();
    });
    expect(result.current.form).toEqual({
      ...result.current.form,
      development_goals: [
        {
          ...defaultGoal,
        },
        {
          ...defaultGoal,
        },
      ],
    });

    act(() => {
      result.current.onRemoveGoal();
    });
    expect(result.current.form).toEqual(defaultForm);
  });

  it('adds an athlete goal url in the form correctly', () => {
    act(() => {
      result.current.onAddUrl(0);
    });

    expect(result.current.form).toEqual({
      ...result.current.form,
      development_goals: [
        {
          ...defaultGoal,
          attached_links: [
            defaultAttachedLink,
            { ...defaultAttachedLink, id: null },
          ],
        },
      ],
    });
  });
});

describe('useLastReviewNote', () => {
  const { act } = TestRenderer;

  const mockSearchReviewList = searchReviewList;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLastReviewNote());

    expect(result.current.lastReviewNote).toBeNull();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.fetchError).toBeNull();
  });

  it('should set isFetching to true when fetchLastReviewNote is called', async () => {
    const { result } = renderHook(() => useLastReviewNote());

    act(() => {
      result.current.fetchLastReviewNote(1);
    });

    expect(result.current.isFetching).toBe(true);
  });

  it('should fetch the last review note and update state correctly', async () => {
    const mockResponse = {
      events: [
        { review_note: 'Old Note', start_date: '2024-01-01' },
        { review_note: 'Most Recent Note', start_date: '2024-02-01' },
      ],
    };
    mockSearchReviewList.mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useLastReviewNote());

    act(() => {
      result.current.fetchLastReviewNote(1);
    });

    await waitForNextUpdate();

    expect(result.current.lastReviewNote).toBe('Most Recent Note');
    expect(result.current.isFetching).toBe(false);
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Fetch error');
    mockSearchReviewList.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useLastReviewNote());

    act(() => {
      result.current.fetchLastReviewNote(1);
    });

    await waitForNextUpdate();

    expect(result.current.fetchError).toEqual(mockError);
    expect(result.current.isFetching).toBe(false);
  });
});
