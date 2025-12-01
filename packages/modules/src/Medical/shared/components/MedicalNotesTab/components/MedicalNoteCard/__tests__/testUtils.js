// @flow
import { render } from '@testing-library/react';
import { jest } from '@jest/globals';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import type { Node } from 'react';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { NotesPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { MedicalNote } from '../../../../../types/medical';
import { MockMedicalNote } from '../mocks';
import PresentationView from '../PresentationView';

export { DEFAULT_CONTEXT_VALUE };

type PropsType = {
  isLoading: boolean,
  withAvatar: boolean,
  note: MedicalNote,
  hasActions: true,
  onSetViewType: Function,
  onArchiveNote: Function,
  onDuplicateNote: Function,
  t: Translation,
};

export const defaultProps = {
  isLoading: false,
  withAvatar: false,
  note: MockMedicalNote,
  hasActions: true,
  onSetViewType: jest.fn(),
  onArchiveNote: jest.fn(),
  onDuplicateNote: jest.fn(),
  t: i18nextTranslateStub(),
};

export const onTrialProps = {
  ...defaultProps,
  athleteData: { constraints: { organisation_status: 'TRIAL_ATHLETE' } },
};

export const wrapRenderWithPermissions = (
  passedPermissions: PermissionsType,
  children: Node,
  props: PropsType,
  notePermissions: NotesPermissions
) => {
  const fullNotePermissions = {
    medical: {
      ...DEFAULT_CONTEXT_VALUE.permissions.medical,
      notes: {
        canCreate: true,
        canArchive: true,
        canEdit: true,
        ...notePermissions,
      },
    },
  };
  return (
    <PermissionsContext.Provider
      value={{
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          ...fullNotePermissions,
          ...passedPermissions,
        },
        permissionsRequestStatus: 'SUCCESS',
      }}
    >
      {children ?? <PresentationView {...defaultProps} {...props} />}
    </PermissionsContext.Provider>
  );
};

export const renderFunction = (propsIn: PropsType) => {
  render(<PresentationView {...defaultProps} {...propsIn} />);
};
