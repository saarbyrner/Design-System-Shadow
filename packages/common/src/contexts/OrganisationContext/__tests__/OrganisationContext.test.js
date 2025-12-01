import $ from 'jquery';
import { render } from '@testing-library/react';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { OrganisationProvider, useOrganisation } from '..';

// eslint-disable-next-line jest/no-mocks-import
import mockedOrganisation from '../__mocks__/organisation';

import {
  mockOrganisationContext,
  cleanUpOrganisationContext,
} from './testUtils';

const TestingComponent = () => {
  const { organisation } = useOrganisation();

  return (
    <>
      <p id="organisation">{JSON.stringify(organisation)}</p>
    </>
  );
};

describe('OrganisationContext', () => {
  beforeEach(() => {
    const deferred = $.Deferred();
    jest.spyOn($, 'ajax').mockImplementation(() =>
      deferred.resolve({
        ...mockedOrganisation,
        coding_system_key: codingSystemKeys.ICD,
      })
    );
  });

  describe('<OrganisationContext/>', () => {
    beforeEach(() => {
      mockOrganisationContext({
        organisation: mockedOrganisation,
      });
    });

    afterEach(() => {
      cleanUpOrganisationContext();
    });

    it('sets the context with hardcoded coding_system_key', () => {
      const component = render(
        <OrganisationProvider>
          <TestingComponent />
        </OrganisationProvider>
      );

      expect(
        component.getByText(
          `{"id":1,"name":"Arsenal","coding_system_key":"osics_10"}`
        )
      ).toBeInTheDocument();
    });
  });
});
