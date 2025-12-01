# Component Documentation: `IssueExaminationDatePicker`

## Overview

The `IssueExaminationDatePicker` is a functional component designed to provide a user interface for selecting two key dates related to a medical issue: the "Date of Injury" (or occurrence) and the "Date of Examination".

It calculates the valid selectable date range (`minDate` and `maxDate`) by aggregating multiple sources of date information, including the athlete's active periods, ancillary service eligibility ranges, and the date of the initial diagnosis. This ensures that users can only select contextually valid dates.

The component renders two instances of the `MovementAwareDatePicker`, a specialized date picker from the Kitman Labs design system, and is wrapped with the `withNamespaces` HOC for internationalization support.

## Dependencies

This component relies on several key libraries and internal components:

-   `MovementAwareDatePicker` as the core date input component at the core of this (and MUI's DatePicker a level further).
-   `@kitman/modules/src/Medical/shared/redux/services/medicalShared`: For the `useGetAncillaryEligibleRangesQuery` hook to fetch date ranges.

## Props

The component accepts the following props:

| Prop Name                 | Type                                    | Required | Description                                                                                                                              |
| ------------------------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `athleteId`               | `number` \| `string`                    | Yes      | The unique identifier for the athlete. Used to fetch ancillary date ranges.                                                              |
| `athleteData`             | `AthleteData`                           | Yes      | An object containing athlete information, specifically `constraints.active_periods`.                                                   |
| `examinationDateProps`    | `Object`                                | Yes      | An object containing `selectedDiagnosisDate` and `selectedExaminationDate`.                                                              |
| `isEditMode`              | `boolean`                               | Yes      | A flag to indicate if the component is in edit mode. (Note: This prop is passed but not directly used in the provided code snippet).    |
| `getFieldLabel`           | `(field: string) => string`             | No       | A function to get translated labels for fields. (Note: This prop is passed but not directly used in the provided code snippet).         |
| `maxPermittedExaminationDate` | `?string`                               | No       | An optional maximum date allowed for the examination. (Note: This prop is passed but not directly used in the provided code snippet). |
| `onSelectExaminationDate` | `(date: string \| null) => void`        | Yes      | Callback function triggered when an examination date is selected. (Note: This prop is passed but not directly used).                    |
| `onChangeExaminationDate` | `(date: string) => void`                | Yes      | Callback function triggered when the "Date of examination" value changes.                                                                |
| `onChangeOccurrenceDate`  | `(date: string) => void`                | Yes      | Callback function triggered when the "Date of injury" value changes.                                                                     |
| `type`                    | `'examination'` \| `'issue'`            | Yes      | Specifies the context type. (Note: This prop is passed but not directly used in the provided code snippet).                            |
| `onSelectDetail`          | `(type: string, value: any) => void`    | Yes      | Generic callback for selecting details. (Note: This prop is passed but not directly used in the provided code snippet).                |
| `details`                 | `Object`                                | Yes      | An object containing the current `occurrenceDate` value.                                                                                 |

---

## Data Fetching

The component uses the `useGetAncillaryEligibleRangesQuery` RTK Query hook to fetch eligible date ranges for the given `athleteId`. This query is skipped if `athleteId` is not provided. The fetched ranges contribute to the calculation of the overall `minDate` and `maxDate`.

## Date Range Calculation Logic

The core logic of this component is the dynamic calculation of the minimum and maximum selectable dates.

### Minimum Date (`minDate`)

The `minDate` is determined by finding the **earliest** date among the following:

1.  **Today's Date**: The initial default value.
2.  **Date of Diagnosis**: The `selectedDiagnosisDate` from `examinationDateProps`.
3.  **Athlete Active Periods**: The `start` date of each period in `athleteData.constraints.active_periods`.
4.  **Ancillary Eligible Ranges**: The `start` date of each range fetched from the API.

### Maximum Date (`maxDate`)

The `maxDate` is determined by finding the **latest** date among the following:

1.  **Today's Date**: The initial default value.
2.  **Athlete Active Periods**: The `end` date of each period in `athleteData.constraints.active_periods`.
3.  **Ancillary Eligible Ranges**: The `end` date of each range fetched from the API.

This calculated range (`minDate` to `maxDate`) is then passed to both `MovementAwareDatePicker` instances via the `providedDateRanges` prop.

## Rendered Output

The component renders two `MovementAwareDatePicker` inputs side-by-side within a `Box` layout container:

1.  **Date of injury**:
    -   **Label**: "Date of injury"
    -   **Value**: Controlled by `props.details.occurrenceDate`.
    -   **`onChange`**: Calls `props.onChangeOccurrenceDate`.

2.  **Date of examination**:
    -   **Label**: "Date of examination"
    -   **Value**: Controlled by `props.examinationDateProps.selectedExaminationDate`.
    -   **`onChange`**: Calls `props.onChangeExaminationDate`.

## Usage Example

```jsx
import IssueExaminationDatePicker from './IssueExaminationDatePicker';

const MyMedicalForm = (props) => {
  // ... state management for dates and details

  return (
    <IssueExaminationDatePicker
      athleteId={123}
      athleteData={athleteData} // from API
      examinationDateProps={{
        selectedDiagnosisDate: '2023-10-26T00:00:00.000Z',
        selectedExaminationDate: examinationDate
      }}
      isEditMode={true}
      details={{ occurrenceDate: injuryDate }}
      type="issue"
      onChangeOccurrenceDate={setInjuryDate}
      onChangeExaminationDate={setExaminationDate}
      // ... other props
    />
  );
};
