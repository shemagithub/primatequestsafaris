const MEASUREMENT_ID = "G-8QS57283Y6";

type GtagFn = (...args: unknown[]) => void;

function gtag(): GtagFn | undefined {
  return (window as Window & { gtag?: GtagFn }).gtag;
}

export function trackPageView(path: string) {
  gtag()?.("event", "page_view", {
    send_to: MEASUREMENT_ID,
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}
