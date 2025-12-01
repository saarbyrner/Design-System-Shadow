// @flow
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';
import style from './style';
import type { QuestionSection } from '../../types/medical/QuestionTypes';
import QuestionGroupDisplay from './QuestionGroupDisplay';
import QuestionTableDisplay from './QuestionTableDisplay';

type Props = {
  sections: Array<QuestionSection>,
  mergeSections: boolean,
  firstSectionHeader?: ?string,
};

const sectionColumns = (columns: number) => css`
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: 16px;
  @media (max-width: ${breakPoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const QuestionSectionsDisplay = (props: Props) => {
  const renderSectionElements = (elements) => {
    return elements.map((element) => {
      switch (element.type) {
        case 'separator': {
          return (
            <div
              css={style.separator}
              key={element.id}
              data-testid="QuestionSectionsDisplay|Separator"
            />
          );
        }
        case 'table': {
          return <QuestionTableDisplay group={element} key={element.id} />;
        }
        default:
          return <QuestionGroupDisplay group={element} key={element.id} />;
      }
    });
  };

  const renderSections = () => {
    return props.sections.map((section, index) => (
      <div
        css={props.mergeSections ? style.mergedSection : style.section}
        key={`section_${section.id}`}
        data-testid="QuestionSectionsDisplay|Section"
      >
        {index === 0 && props.firstSectionHeader && (
          <h2
            className="kitmanHeading--L2"
            css={style.titleHeader}
            data-testid="QuestionSectionsDisplay|HeaderTitle"
          >
            {props.firstSectionHeader}
          </h2>
        )}
        {section.title && (
          <h3
            className="kitmanHeading--L3"
            data-testid="QuestionSectionsDisplay|Title"
          >
            {section.title}
          </h3>
        )}
        <div
          css={sectionColumns(section.columns != null ? section.columns : 1)}
        >
          {renderSectionElements(section.elements)}
        </div>
        {props.mergeSections && index < props.sections.length - 1 && (
          <div css={style.sectionSeparator} />
        )}
      </div>
    ));
  };

  return <>{renderSections()}</>;
};

export default QuestionSectionsDisplay;
