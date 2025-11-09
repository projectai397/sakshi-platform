import { router } from '../../_core/trpc';
import { sponsorshipsRouter } from './sponsorships';
import { farmTransparencyRouter } from './farm-transparency';
import { zeroWasteRouter } from './zero-waste';
import { ayurvedicRouter } from './ayurvedic';
import { mindfulDiningRouter } from './mindful-dining';
import { regenerativeCreditsRouter } from './regenerative-credits';
import { nutritionPassportRouter } from './nutrition-passport';
import { impactDashboardRouter } from './impact-dashboard';

export const innovationsRouter = router({
  sponsorships: sponsorshipsRouter,
  farmTransparency: farmTransparencyRouter,
  zeroWaste: zeroWasteRouter,
  ayurvedic: ayurvedicRouter,
  mindfulDining: mindfulDiningRouter,
  regenerativeCredits: regenerativeCreditsRouter,
  nutritionPassport: nutritionPassportRouter,
  impactDashboard: impactDashboardRouter,
});
