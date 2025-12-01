/* eslint-disable react/no-array-index-key */
// @flow
import type { Node } from 'react';
import { css } from '@emotion/react';
import { Children } from 'react';
import colours from '../../../common/src/variables/colors';
import MenuLink from './MenuLink';
import MenuText from './MenuText';
import TooltipDropdown from './TooltipDropdown';

type BreadCrumbProps = {
  children: Array<Node>,
};

const BreadCrumb = (props: BreadCrumbProps) => {
  const style = {
    breadCrumb: css`
      margin-left: 0;
      margin-right: 0;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .breadCrumb__disabledLink {
        color: ${colours.s16};
        font-weight: normal;
      }
      .breadCrumb__textItem {
        color: ${colours.s16};
        font-weight: 600;
      }
      .breadCrumb__currentItem {
        font-weight: 600;
        margin-bottom: 0;

        .breadCrumb:hover {
          cursor: pointer;
        }
      }
      .breadCrumb__currentItem--disabled {
        color: ${colours.s16};

        .breadCrumb__downArrow {
          cursor: default;
        }
      }
      .breadCrumb__downArrow {
        cursor: pointer;
        display: block;
        float: right;
        font-size: 9px;
        line-height: 30px;
        margin-left: 5px;
      }
    `,

    breadCrumbItem: css`
      float: left;
      font-weight: bold;
      margin-right: 5px;
      .breadCrumb__raquo {
        color: ${colours.s16};
      }
    `,
  };
  return (
    <div
      className="row breadCrumb"
      css={style.breadCrumb}
      aria-label="Breadcrumb"
    >
      <ul>
        {Children.map(props.children, (menuItem, index) => {
          const items = [];
          items.push(menuItem);
          if (index !== Children.count(props.children) - 1) {
            items.push(
              <span className="breadCrumb__raquo" key={`raquo${index}`}>
                {' '}
                &raquo;
              </span>
            );
          }

          // N.B. It's not expected that the order of breadcrumb items will change
          return (
            <li
              css={style.breadCrumbItem}
              className="breadCrumb__item"
              key={index}
            >
              {items}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

BreadCrumb.MenuLink = MenuLink;
BreadCrumb.MenuText = MenuText;
BreadCrumb.TooltipDropdown = TooltipDropdown;

export default BreadCrumb;
