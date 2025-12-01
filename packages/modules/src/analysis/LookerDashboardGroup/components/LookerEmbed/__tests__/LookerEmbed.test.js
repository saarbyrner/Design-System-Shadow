import React from 'react';
import { render } from '@testing-library/react';
import { getEmbedSDK } from '@looker/embed-sdk';
import LookerEmbed from '@kitman/modules/src/analysis/LookerDashboardGroup/components/LookerEmbed';

jest.mock('@looker/embed-sdk');
jest.spyOn(React, 'useRef').mockReturnValue({ current: null });

describe('LookerEmbed', () => {
  let mockConnection;
  let mockDashboard;

  beforeEach(() => {
    mockConnection = {
      loadDashboard: jest.fn().mockResolvedValue({}),
    };

    mockDashboard = {
      createDashboardWithId: jest.fn().mockReturnThis(),
      withAllowAttr: jest.fn().mockReturnThis(),
      appendTo: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnThis(),
      connect: jest.fn().mockResolvedValue(mockConnection),
    };

    getEmbedSDK.mockReturnValue(mockDashboard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does setup dashboard when lookerConnectionRef.current is null', () => {
    render(<LookerEmbed dashboardId={123} />);
    expect(getEmbedSDK).toHaveBeenCalledTimes(1);
  });

  it('does not call loadDashboard when connection is null', () => {
    render(<LookerEmbed dashboardId={123} />);
    expect(mockConnection.loadDashboard).not.toHaveBeenCalled();
  });

  describe('when lookerConnectionRef.current is set', () => {
    beforeEach(() => {
      React.useRef.mockReturnValue({ current: mockConnection });
    });

    afterEach(() => {
      React.useRef.mockReturnValue({ current: null });
    });

    it('calls loadDashboard when dashboardId changes', () => {
      render(<LookerEmbed dashboardId={456} />);

      expect(mockConnection.loadDashboard).toHaveBeenCalledWith('456');
    });
  });
});
