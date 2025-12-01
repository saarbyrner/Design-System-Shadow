import printDiagnosticLabel from '../PrintDiagnosticLabel';

describe('printDiagnosticLabel', () => {
  it('renders correct XML for sending to DYMO printer with supplied props & template', async () => {
    const generatedLabel = printDiagnosticLabel({
      clientNumber: 7656532,
      orderNumber: 354353459021090210,
      athleteName: 'Erling Haaland',
    });

    expect(generatedLabel).toContain('7656532');
    expect(generatedLabel).toContain('354353459021090240');
    expect(generatedLabel).toContain('Erling Haaland');
  });
});
