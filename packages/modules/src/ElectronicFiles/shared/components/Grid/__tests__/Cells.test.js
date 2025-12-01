import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { FIELD_KEY } from '@kitman/modules/src/ElectronicFiles/shared/types';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import buildCellContent from '@kitman/modules/src/ElectronicFiles/shared/components/Grid/Cells';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { data as outboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchOutboundElectronicFileList.mock';
import { data as contactsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchContactList.mock';

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockOnAttachmentsChipClick = jest.fn();
const mockOnAttachedToChipClick = jest.fn();
const mockOnToggleContactFavorite = jest.fn();

const mockInboundElectronicFile = inboundData.data[0];
const mockOutboundElectronicFile = outboundData.data[0];
const mockContact = contactsData.data[0];

describe('buildCellContent', () => {
  it('renders received from cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.received_from,
        row: mockOutboundElectronicFile,
        onAttachmentsChipClick: mockOnAttachmentsChipClick,
      })
    );

    expect(
      screen.getByText(
        mockInboundElectronicFile.received_from.fax_number.number
      )
    ).toBeInTheDocument();
  });
  it('renders sent to from cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.sent_to,
        row: mockOutboundElectronicFile,
        onAttachmentsChipClick: mockOnAttachmentsChipClick,
      })
    );

    expect(
      screen.getByText(mockOutboundElectronicFile.sent_to[0].fax_number.number)
    ).toBeInTheDocument();
  });

  it('renders attachment cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.attachment,
        row: mockInboundElectronicFile,
        onAttachmentsChipClick: mockOnAttachmentsChipClick,
      })
    );

    expect(
      screen.getByRole('link', {
        name: 'View File',
        href: mockInboundElectronicFile.attachment.url,
      })
    ).toBeInTheDocument();
  });

  it('renders attachedTo cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.attachedTo,
        row: mockInboundElectronicFile,
        onAttachmentsChipClick: mockOnAttachedToChipClick,
      })
    );

    expect(
      screen.getByText(
        `${mockInboundElectronicFile.efax_allocations.length} players`
      )
    ).toBeInTheDocument();
  });

  it('renders attachments cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.attachments,
        row: mockOutboundElectronicFile,
        onAttachmentsChipClick: mockOnAttachmentsChipClick,
      })
    );

    expect(
      screen.getByText(
        `${mockOutboundElectronicFile.attachments.length} attachment`
      )
    ).toBeInTheDocument();
  });

  it('renders date cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.date,
        row: mockOutboundElectronicFile,
        onAttachmentsChipClick: mockOnAttachmentsChipClick,
      })
    );

    expect(screen.getByText('Mar 24, 2024')).toBeInTheDocument();
  });

  it('renders delivery status cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.delivery_status,
        row: mockOutboundElectronicFile,
        onAttachmentsChipClick: mockOnAttachmentsChipClick,
      })
    );

    expect(screen.getByText('Sent')).toBeInTheDocument();
  });

  it('renders favorite contact cell correctly when the contact is not favorited', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.toggle_contact_favorite,
        row: mockContact,
        onToggleContactFavorite: mockOnToggleContactFavorite,
      })
    );

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.StarBorder}Icon`)
    ).toBeInTheDocument();
  });

  it('renders favorite contact cell correctly when the contact is favorited', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.toggle_contact_favorite,
        row: {
          ...mockContact,
          favorite: true,
        },
      })
    );

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.Star}Icon`)
    ).toBeInTheDocument();
  });

  it('renders company name cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.company_name,
        row: mockContact,
      })
    );

    expect(screen.getByText(mockContact.company_name)).toBeInTheDocument();
  });

  it('renders fax number cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.fax_number,
        row: mockContact,
      })
    );

    expect(screen.getByText(mockContact.fax_number.number)).toBeInTheDocument();
  });

  it('renders name cell correctly', () => {
    render(
      buildCellContent({
        field: FIELD_KEY.name,
        row: mockContact,
      })
    );

    expect(
      screen.getByText(`${mockContact.first_name} ${mockContact.last_name}`)
    ).toBeInTheDocument();
  });
});
