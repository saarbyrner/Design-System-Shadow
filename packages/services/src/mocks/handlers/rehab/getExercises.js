import { rest } from 'msw';

const data = {
  rehab_exercises: [
    {
      id: 80,
      name: '1/2 Kneeling Ankle Mobility',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
    {
      id: 91,
      name: '3 Way Ankle',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
    {
      id: 44,
      name: 'Bicep Curls',
      variations_type: 'sets_reps_weight',
      variations_title: 'Sets x Reps x Weight',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
    {
      id: 127,
      name: 'Bird Dogs',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
  ],
  meta: {
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 3,
    total_count: 137,
  },
};

const steamboatKeywordResultsData = {
  rehab_exercises: [
    {
      id: 96,
      name: 'Ankle Steamboats (4 Way)',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
  ],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 1,
  },
};
const fourWayAnkleKeywordResultsData = {
  rehab_exercises: [
    {
      id: 80,
      name: '1/2 Kneeling Ankle Mobility',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
    {
      id: 91,
      name: '3 Way Ankle',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },

    {
      id: 45,
      name: '1 way ankle',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
    {
      id: 46,
      name: '2 way hip',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
  ],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 1,
  },
};
const ankleKeywordResultsData = {
  rehab_exercises: [
    {
      id: 80,
      name: '1/2 Kneeling Ankle Mobility',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
    {
      id: 91,
      name: '3 Way Ankle',
      variations_type: 'sets_reps',
      variations_title: 'Sets x Reps',
      variations_default: {},
      notes: null,
      rehab_category: null,
    },
  ],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 1,
  },
};

const getMockDataForExercise = (exerciseName) => {
  switch (exerciseName) {
    case 'ankle':
      return ankleKeywordResultsData;
    case '4 way ankle':
      return fourWayAnkleKeywordResultsData;
    case 'steamboat':
      return steamboatKeywordResultsData;
    default:
      return data;
  }
};

const handler = rest.post(
  '/ui/medical/rehab/exercises/search',
  async (req, res, ctx) => {
    const requestData = await req.json();
    return res(
      ctx.json(getMockDataForExercise(requestData.rehab_exercise_name))
    );
  }
);

export { handler, data, ankleKeywordResultsData, getMockDataForExercise };
