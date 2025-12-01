// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

export default {
  container: css`
    background: ${colors.white};
    margin: 16px 20px;

    .dataGrid {
      &__headLine {
        top: 15px;
      }
      &__cell {
        padding: 15px 25px;
      }
      &__loading {
        margin-bottom: 12px;
      }

      // stack the columns as rows on mobile
      @media only screen and (max-width: ${breakPoints.tablet}) {
        .dataGrid__headLine {
          display: none;
        }

        table {
          border: 0;
          margin-top: 20px;

          // hide the table headers without display: none; for accessibility
          thead {
            tr {
              position: absolute;
              top: -9999px;
              left: -9999px;
            }
          }

          tbody {
            tr {
              display: block;

              &:first-of-type {
                td {
                  &:first-of-type {
                    border-top: 1px solid ${colors.neutral_300};
                  }
                }
              }

              td {
                display: block;
                text-align: right;
                width: 100%;
                max-width: 100%;

                &::before {
                  content: attr(data-mobile-label);
                  float: left;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }

      // stack the row header and content on small screen sizes
      @media only screen and (max-width: 280px) {
        table {
          tbody {
            tr {
              td {
                text-align: left;

                &::before {
                  float: unset;
                  display: block;
                }
              }
            }
          }
        }
      }
    }

    td.dataGrid__cell,
    td.dataGrid__fillerCell {
      border-bottom: 1px solid ${colors.neutral_300};
    }
  `,
  header: css`
    padding: 25px 25px 0;
    display: flex;
    justify-content: space-between;

    h6 {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }

    @media screen and (max-width: 500px) {
      flex-direction: column;

      h6 {
        margin-bottom: 1rem;
      }
    }
  `,
  actionButtons: css`
    display: flex;
    gap: 8px;
  `,
  downloadLink: css`
    a {
      color: ${colors.grey_200};
      padding-left: 5px;
      text-decoration: underline;
    }
  `,
  statusIndicator: css`
    display: inline-block;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: ${colors.white};
    padding: 2px 7px;
    border-radius: 30px;
  `,
  inProgressStatus: css`
    background: ${colors.orange_100};
  `,
  successStatus: css`
    background: ${colors.green_100};
  `,
  errorStatus: css`
    background: ${colors.red_100};
  `,
  expiredStatus: css`
    background: ${colors.cool_mid_grey};
  `,
};
