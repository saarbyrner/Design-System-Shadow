// @flow

import { createApi } from '@reduxjs/toolkit/query/react';

export const calendarSettingsApi = createApi({
  reducerPath: 'calendarSettingsApi',
  endpoints: (builder) => ({
    updateSettings: builder.mutation({
      // Placeholder until the backend endpoint will be written
      query: async (data) => {
        console.log(`Updating the settings: ${JSON.stringify(data, null, 1)}`);
      },
    }),
  }),
});

export const { useUpdateSettingsMutation } = calendarSettingsApi;
