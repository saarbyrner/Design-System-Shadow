import MLS_23_24_ATHLETE_REGISTRATION_FORM from './mock_athlete_form_structure';
import MLS_23_24_STAFF_REGISTRATION_FORM from './mock_staff_form_structure';
import MLS_23_24_SCOUT_REGISTRATION_FORM from './mock_scout_form_structure';

export const data = {
  61: MLS_23_24_ATHLETE_REGISTRATION_FORM,
  62: MLS_23_24_STAFF_REGISTRATION_FORM,
  1: MLS_23_24_SCOUT_REGISTRATION_FORM,
};

export const meta = {
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

export const response = {
  data,
  meta,
};
