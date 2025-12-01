// @flow
import { useState, useCallback } from 'react';
import searchReviewList from '@kitman/modules/src/AthleteReviews/src/shared/services/searchReviewList';

import type {
  ReviewFormData,
  Link,
  FormModeEnumLikeValues,
} from '../shared/types';
import {
  getDefaultReviewForm,
  getDefaultDevelopmentGoal,
  getDefaultLink,
} from '../shared/utils';

export const useReviewFormData = () => {
  const [form, setForm] = useState<ReviewFormData>(getDefaultReviewForm());
  const [formMode, setFormMode] = useState<?FormModeEnumLikeValues>(null);

  const updateForm = (key: string, value: ?(string | Array<Link>)) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onUpdateGoal = (
    index: number,
    key: string,
    value: string | Array<Link>
  ) => {
    setForm((prev) => ({
      ...prev,
      development_goals: prev.development_goals.map((goal, i) =>
        i === index ? { ...goal, [key]: value } : goal
      ),
    }));
  };

  const onAddGoal = () => {
    setForm((prev) => ({
      ...prev,
      development_goals: prev.development_goals
        .slice()
        .concat(getDefaultDevelopmentGoal()),
    }));
  };

  const onRemoveGoal = (goalRemovalIndex: number) => {
    setForm((prev) => {
      const removalGoals = prev.development_goals.slice();
      removalGoals.splice(goalRemovalIndex, 1);
      return {
        ...prev,
        development_goals: removalGoals,
      };
    });
  };

  const onAddUrl = (developmentGoalIndex: number) => {
    setForm((prevFormUpdate) => ({
      ...prevFormUpdate,
      development_goals: prevFormUpdate.development_goals.map((goal, i) =>
        i === developmentGoalIndex
          ? {
              ...goal,
              attached_links: goal.attached_links.concat(getDefaultLink()),
            }
          : goal
      ),
    }));
  };

  return {
    form,
    setForm,
    formMode,
    setFormMode,
    updateForm,
    onUpdateGoal,
    onAddGoal,
    onRemoveGoal,
    onAddUrl,
  };
};

export const useLastReviewNote = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [lastReviewNote, setLastReviewNote] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const fetchLastReviewNote = useCallback(async (athleteId: ?number) => {
    if (!athleteId) {
      return;
    }

    setIsFetching(true);
    setFetchError(null);

    try {
      const response = await searchReviewList(athleteId, {
        athlete_review_type_id: null,
        review_end_date: null,
        review_start_date: null,
        review_status: null,
        user_ids: [],
      });
      const events = response?.events || [];
      const mostRecentEvent = events
        .filter((event) => event.review_note && event.review_note.trim() !== '')
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))[0];
      setLastReviewNote(mostRecentEvent?.review_note || null);
    } catch (error) {
      setFetchError(error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    lastReviewNote,
    isFetching,
    fetchError,
    fetchLastReviewNote,
  };
};
