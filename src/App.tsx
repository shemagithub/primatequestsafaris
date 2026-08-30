import { lazy, Suspense, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

import { SiteProvider } from '@/context/SiteContext';
import { trackPageView } from '@/lib/analytics';

const Home = lazy(() => import('@/pages/Home'));
const Tours = lazy(() => import('@/pages/Tours'));
const TourDetail = lazy(() => import('@/pages/TourDetail'));
const About = lazy(() => import('@/pages/About'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient();

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    scrollToPageTop();
    const frame = requestAnimationFrame(() => {
      scrollToPageTop();
    });
    const timer = window.setTimeout(scrollToPageTop, 50);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [location]);

  return null;
}

function Analytics() {
  const [location] = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = window.setTimeout(() => trackPageView(location), 80);
    return () => window.clearTimeout(timer);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tours/:id" component={TourDetail} />
        <Route path="/tours" component={Tours} />
        <Route path="/about" component={About} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog" component={Blog} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        <TooltipProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-accent focus:text-primary focus:px-4 focus:py-2 focus:font-bold"
          >
            Skip to content
          </a>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <ScrollToTop />
            <Analytics />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </SiteProvider>
    </QueryClientProvider>
  );
}

export default App;
