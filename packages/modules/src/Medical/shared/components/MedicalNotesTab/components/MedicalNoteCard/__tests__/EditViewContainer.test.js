import { render } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import EditViewContainer from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab/components/MedicalNoteCard/EditViewContainer';
import { MockMedicalNote } from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab/components/MedicalNoteCard/mocks';
import useEditMedicalNoteForm from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab/components/MedicalNoteCard/hooks/useEditMedicalNoteForm';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useAthletesIssuesGrouped from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssuesAsGroupedSelectOptions';
import { useGetStaffUsersQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/components/MedicalNotesTab/components/MedicalNoteCard/EditView',
  () => ({
    EditViewTranslated: jest.fn(() => null),
  })
);

// Mock the useEditMedicalNoteForm hook
jest.mock(
  '@kitman/modules/src/Medical/shared/components/MedicalNotesTab/components/MedicalNoteCard/hooks/useEditMedicalNoteForm',
  () => jest.fn()
);

// Mock other hooks used in EditViewContainer
jest.mock('@kitman/common/src/hooks/useEventTracking', () => jest.fn());
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  usePermissions: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/Medical/shared/hooks/useAthletesIssuesAsGroupedSelectOptions',
  () => jest.fn()
);
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetStaffUsersQuery: jest.fn(),
}));

describe('<EditViewContainer/>', () => {
  const mockDispatch = jest.fn();
  const mockTrackEvent = jest.fn();
  const mockFormDispatch = jest.fn();

  beforeEach(() => {
    useEditMedicalNoteForm.mockReturnValue({
      formState: {
        organisation_annotation_type_id:
          MockMedicalNote.organisation_annotation_type.id,
        title: MockMedicalNote.title,
        annotation_date: MockMedicalNote.annotation_date,
        content: MockMedicalNote.content,
        illnessIds: MockMedicalNote.illness_occurrences.map(
          (illness) => illness.id
        ),
        injuryIds: MockMedicalNote.injury_occurrences.map(
          (injury) => injury.id
        ),
        chronicIds: MockMedicalNote.chronic_issues.map((issue) => issue.id),
        restricted_to_doc: false,
        restricted_to_psych: false,
        squadId: MockMedicalNote.squad?.id,
        annotation_actions_attributes: [],
        scope_to_org: true,
        attachments: MockMedicalNote.attachments,
        authorId: MockMedicalNote.author.id,
        note_visibility_ids: [],
      },
      dispatch: mockFormDispatch,
    });
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    usePermissions.mockReturnValue({
      permissions: { medical: { privateNotes: { canCreate: true } } },
    });
    useAthletesIssuesGrouped.mockReturnValue({
      athleteIssuesOptions: [],
      isLoading: false,
    });
    useGetStaffUsersQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    useDispatch.mockReturnValue(mockDispatch);
  });

  it('calls useEditMedicalNoteForm with squadId when note.squad exists', () => {
    const noteWithSquad = {
      ...MockMedicalNote,
      squad: { id: 123, name: 'Test Squad' },
    };

    render(
      <EditViewContainer
        note={noteWithSquad}
        athleteId={1}
        onSetViewType={jest.fn()}
        viewType="EDIT"
        onReloadData={jest.fn()}
        isPastAthlete={false}
      />
    );

    expect(useEditMedicalNoteForm).toHaveBeenCalledWith(
      expect.objectContaining({
        squadId: 123,
      })
    );
  });

  it('calls useEditMedicalNoteForm with squadId as null when note.squad does not exist', () => {
    const noteWithoutSquad = {
      ...MockMedicalNote,
      squad: null, // Ensure squad is null to test optional chaining
    };

    render(
      <EditViewContainer
        note={noteWithoutSquad}
        athleteId={1}
        onSetViewType={jest.fn()}
        viewType="EDIT"
        onReloadData={jest.fn()}
        isPastAthlete={false}
      />
    );

    expect(useEditMedicalNoteForm).toHaveBeenCalledWith(
      expect.objectContaining({
        squadId: null,
      })
    );
  });
});
