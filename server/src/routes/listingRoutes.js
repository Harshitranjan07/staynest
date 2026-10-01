import { Router } from 'express';
import {
  getListings,
  getMyListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getReviews,
  addReview,
} from '../controllers/listingController.js';
import { protect, hostOnly } from '../middleware/auth.js';

const router = Router();

router.route('/').get(getListings).post(protect, hostOnly, createListing);
router.get('/mine', protect, hostOnly, getMyListings);
router
  .route('/:id')
  .get(getListing)
  .put(protect, hostOnly, updateListing)
  .delete(protect, hostOnly, deleteListing);
router.route('/:id/reviews').get(getReviews).post(protect, addReview);

export default router;
