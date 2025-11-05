import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Volunteer from "./pages/Volunteer";
import SevaWallet from "./pages/SevaWallet";
import RepairCafe from "./pages/RepairCafe";
import CircularEconomy from "./pages/CircularEconomy";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import SilentVillage from "./pages/SilentVillage";
import VillageApply from "./pages/VillageApply";
import Retreats from "./pages/Retreats";
import Meditate from "./pages/Meditate";
import RetreatDetail from "./pages/RetreatDetail";
import RetreatBooking from "./pages/RetreatBooking";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Donate from "./pages/Donate";
import Cafes from "./pages/Cafes";
import CafeLocations from "./pages/CafeLocations";
import CafeJoin from "./pages/CafeJoin";
import Dashboard from "./pages/Dashboard";
import { ChatbotWidget } from "./components/ChatbotWidget";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/about" component={About} />
      <Route path="/volunteer" component={Volunteer} />
      <Route path="/seva-wallet" component={SevaWallet} />
      <Route path="/repair-cafe" component={RepairCafe} />
      <Route path="/circular-economy" component={CircularEconomy} />
      <Route path="/admin" component={Admin} />
      <Route path="/profile" component={Profile} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/village" component={SilentVillage} />
      <Route path="/village/apply" component={VillageApply} />
      <Route path="/retreats" component={Retreats} />
      <Route path="/meditate" component={Meditate} />
      <Route path="/retreats/:id" component={RetreatDetail} />
      <Route path="/retreats/:id/book" component={RetreatBooking} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/donate" component={Donate} />
      <Route path="/cafes" component={Cafes} />
      <Route path="/cafes/locations" component={CafeLocations} />
      <Route path="/cafes/join" component={CafeJoin} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <ChatbotWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
