import { handler as editReviewHandler } from './editReview';
import { handler as getReviewHandler } from './getReview';
import { handler as saveReviewHandler } from './createReview';
import { handler as searchReviewListHandler } from './searchReviewList';
import { handler as updateDevelopmentGoal } from './updateDevelopmentGoal';
import { handler as deleteReviewComment } from './deleteReviewComment';


export default [
  editReviewHandler,
  getReviewHandler,
  saveReviewHandler,
  searchReviewListHandler,
  updateDevelopmentGoal,
  deleteReviewComment,
];
