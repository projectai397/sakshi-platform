import { router } from '../../trpc';
import { cafeMenuRouter } from './menu';
import { cafeOrdersRouter } from './orders';
import { recipesRouter } from './recipes';
import { cookingClassesRouter } from './classes';
import { mealSubscriptionsRouter } from './subscriptions';
import { cafeLocationsRouter, franchisesRouter } from './locations';
import { healthTrackingRouter } from './health';

export const cafeRouter = router({
  menu: cafeMenuRouter,
  orders: cafeOrdersRouter,
  recipes: recipesRouter,
  classes: cookingClassesRouter,
  subscriptions: mealSubscriptionsRouter,
  locations: cafeLocationsRouter,
  franchises: franchisesRouter,
  health: healthTrackingRouter,
});
