import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import Seo from '@/components/seo/Seo';
import { pageMeta } from '@/lib/seo';

export default function NotFound() {
  return (
    <div id="main-content" className="min-h-screen w-full flex items-center justify-center bg-background">
      <Seo
        title={pageMeta.notFound.title}
        description={pageMeta.notFound.description}
        noindex
      />
      <Card className="max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This page is not available. Explore gorilla trekking and safari expeditions in Rwanda.
          </p>
          <p className="mt-6">
            <Link href="/">
              <span className="text-sm font-bold uppercase tracking-wider text-primary hover:text-accent cursor-pointer">
                Back to home
              </span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
