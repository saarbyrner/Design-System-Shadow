import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndContext } from '@dnd-kit/core';

import PlayerAvatar from '..';

const mockPlayer = {
  id: '1',
  shortname: 'J. Doe',
  squad_number: 10,
  position: {
    abbreviation: 'FW',
  },
  avatar_url: 'https://example.com/player.jpg',
};

describe('PlayerAvatar', () => {
  const mockOnPlayerClick = jest.fn();

  const dndWrapper = {
    wrapper: ({ children }) => <DndContext>{children}</DndContext>,
  };

  it('renders the player name and position', () => {
    render(
      <PlayerAvatar player={mockPlayer} playerName={mockPlayer.shortname} />
    );

    expect(screen.getByText(mockPlayer.shortname)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockPlayer.position.abbreviation} | #10`)
    ).toBeInTheDocument();
  });

  it('renders the player avatar and fires the onclick when the avatar area is clicked on', async () => {
    const user = userEvent.setup();
    render(
      <PlayerAvatar
        player={mockPlayer}
        playerName={mockPlayer.shortname}
        onPlayerClick={mockOnPlayerClick}
      />
    );
    await user.click(screen.getByAltText('Player Avatar'));
    expect(mockOnPlayerClick).toHaveBeenCalled();
  });

  it('renders the player image with the correct size and border radius', () => {
    render(
      <PlayerAvatar
        player={mockPlayer}
        playerName={mockPlayer.shortname}
        isDisabled
      />,
      dndWrapper
    );

    const avatarImage = screen.getByAltText('Player Avatar');
    expect(avatarImage).toHaveAttribute('src', mockPlayer.image);
  });

  it('shows the role when props "isStaff" is true', () => {
    render(
      <PlayerAvatar
        player={mockPlayer}
        playerName={mockPlayer.shortname}
        isDisabled
        staffRole="Account Admin"
        isStaff
      />,
      dndWrapper
    );

    expect(screen.getByText(mockPlayer.shortname)).toBeInTheDocument();
    expect(screen.getByText('Account Admin')).toBeInTheDocument();
  });

  it('falls back to the default avatar if the avatar_url is empty', () => {
    render(
      <PlayerAvatar
        player={{
          ...mockPlayer,
          avatar_url: null,
        }}
        playerName={mockPlayer.shortname}
        isDisabled
        staffRole="Account Admin"
        isStaff
      />,
      dndWrapper
    );

    const avatarImage = screen.getByAltText('Player Avatar');
    expect(avatarImage).toHaveAttribute('src', '/img/avatar.jpg');
  });

  it('fires onPlayerClick when the PlayerAvatar is not disabled', async () => {
    const onPlayerClickMock = jest.fn();

    const user = userEvent.setup();
    render(
      <PlayerAvatar
        player={{
          ...mockPlayer,
          avatar_url: null,
        }}
        playerName={mockPlayer.shortname}
        isDisabled={false}
        staffRole="Account Admin"
        isStaff
        onPlayerClick={onPlayerClickMock}
      />,
      dndWrapper
    );

    await user.click(screen.getByAltText('Player Avatar'));
    expect(onPlayerClickMock).toHaveBeenCalled();
  });

  it('does not fire onPlayerClick when the PlayerAvatar is disabled', async () => {
    const onPlayerClickMock = jest.fn();
    const user = userEvent.setup();
    render(
      <PlayerAvatar
        player={{
          ...mockPlayer,
          avatar_url: null,
        }}
        playerName={mockPlayer.shortname}
        isDisabled
        staffRole="Account Admin"
        isStaff
        onPlayerClick={onPlayerClickMock}
      />,
      dndWrapper
    );

    await user.click(screen.getByAltText('Player Avatar'));
    expect(onPlayerClickMock).not.toHaveBeenCalled();
  });
});
