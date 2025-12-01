import { supportedEntityTypes, getDocumentSource } from '..';

describe('utils', () => {
  describe('supportedEntityTypes', () => {
    it('should return correct entity types', () => {
      expect(supportedEntityTypes).toMatchSnapshot();
    });
  });

  describe('getDocumentSource', () => {
    beforeEach(() => {
      delete window.location;
      window.location = new URL('http://localhost/medical/athletes/1');
    });

    it('should return correct url and description of a form answer set entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'Prescription Pick Up',
          entity_type: 'form_answers_set',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - Prescription Pick Up');
      expect(href).toEqual('/forms/form_answers_sets/5');
      expect(isChangingTab).toEqual(false);
    });

    it('should return correct url and description of an annotation entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'test title',
          entity_type: 'annotation',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - test title');
      expect(href).toEqual('/medical/athletes/1#medical_notes');
      expect(isChangingTab).toEqual(true);
    });

    it('should return correct url and description of a medical note entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'test title',
          entity_type: 'medical_note',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - test title');
      expect(href).toEqual('/medical/athletes/1#medical_notes');
      expect(isChangingTab).toEqual(true);
    });

    it('should return correct url and description of a medication entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'test title',
          entity_type: 'medication',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - test title');
      expect(href).toEqual('/medical/athletes/1#medications');
      expect(isChangingTab).toEqual(true);
    });

    it('should return correct url and description of a treatment entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'test title',
          entity_type: 'treatment',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - test title');
      expect(href).toEqual('/medical/athletes/1#treatments');
      expect(isChangingTab).toEqual(true);
    });

    it('should return correct url and description of a diagnostic entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'test title',
          entity_type: 'diagnostic',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - test title');
      expect(href).toEqual('/medical/athletes/1/diagnostics/5');
      expect(isChangingTab).toEqual(false);
    });

    it('should return correct url and description of a procedure entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'test title',
          entity_type: 'procedure',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - test title');
      expect(href).toEqual('/medical/procedures/5');
      expect(isChangingTab).toEqual(false);
    });

    it('should return correct url and description of a document_v2 entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_title: 'test title',
          entity_type: 'document_v2',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - test title');
      expect(href).toEqual('/medical/documents/5?isV2Document=true');
      expect(isChangingTab).toEqual(false);
    });

    it('should return correct url and description of an unknown entity', () => {
      const document = {
        entity: {
          id: 5,
          athlete: { id: 1 },
          entity_date: '2021-01-02',
          entity_type: 'unknown',
        },
      };
      const { description, href, isChangingTab } = getDocumentSource(document);
      expect(description).toEqual('Jan 2, 2021 - unknown');
      expect(href).toEqual('/medical/athletes/1');
      expect(isChangingTab).toEqual(false);
    });

    describe('[FEATURE FLAG] - medical-files-sort-by-doc-date', () => {
      beforeEach(() => {
        window.featureFlags['medical-files-sort-by-doc-date'] = true;
      });

      afterEach(() => {
        window.featureFlags['medical-files-sort-by-doc-date'] = false;
      });

      it('should return correct url and description of an annotation entity', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: 'test title',
            entity_type: 'annotation',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('test title');
        expect(href).toEqual('/medical/athletes/1#medical_notes');
      });

      it('should return correct url and description of a medical note entity', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: 'test title',
            entity_type: 'medical_note',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('test title');
        expect(href).toEqual('/medical/athletes/1#medical_notes');
      });

      it('should return correct url and description of a treatment entity', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: 'test title',
            entity_type: 'treatment',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('test title');
        expect(href).toEqual('/medical/athletes/1#treatments');
      });

      it('should return correct url and description of a diagnostic entity', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: 'test title',
            entity_type: 'diagnostic',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('test title');
        expect(href).toEqual('/medical/athletes/1/diagnostics/5');
      });

      it('should return correct url and description of a diagnostic entity without a title', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: null,
            entity_type: 'diagnostic',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('diagnostic');
        expect(href).toEqual('/medical/athletes/1/diagnostics/5');
      });

      it('should return correct url and description of a procedure entity', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: 'test title',
            entity_type: 'procedure',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('test title');
        expect(href).toEqual('/medical/procedures/5');
      });

      it('should return correct url and description of a document_v2 entity with title', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: 'test title',
            entity_type: 'document_v2',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('test title');
        expect(href).toEqual('/medical/documents/5?isV2Document=true');
      });

      it('should return correct url and description of a document_v2 entity without title', () => {
        const document = {
          entity: {
            id: 5,
            athlete: { id: 1 },
            entity_date: '2021-01-02',
            entity_title: null,
            entity_type: 'document_v2',
          },
        };
        const { description, href } = getDocumentSource(document);
        expect(description).toEqual('Documents');
        expect(href).toEqual('/medical/documents/5?isV2Document=true');
      });
    });
  });
});
