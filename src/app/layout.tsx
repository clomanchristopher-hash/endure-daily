import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppStateProvider } from "@/context/AppStateContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { SideNav } from "@/components/layout/SideNav";
import { TopBar } from "@/components/layout/TopBar";
import { SplashScreen } from "@/components/SplashScreen";
import { CompletionCelebration } from "@/components/CompletionCelebration";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
});

export const metadata: Metadata = {
  applicationName: "Endure Daily",
  title: "Endure Daily — Faith & Fitness Devotional",
  description:
    "Daily Scripture, devotion, prayer, and movement challenges for Christians building strength in body and spirit.",
  manifest: "/manifest.webmanifest",
  // iOS "Add to Home Screen": launch standalone (no Safari chrome) with a clean
  // title and status bar. Payments are not enabled — this is display-only.
  appleWebApp: {
    capable: true,
    title: "Endure Daily",
    statusBarStyle: "default",
  },
  // iOS Safari still reads the apple-prefixed flag for standalone launch;
  // Next 16 only emits the modern "mobile-web-app-capable", so add it explicitly.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1510",
  width: "device-width",
  initialScale: 1,
  // Let content extend under the notch/home indicator; safe-area insets are
  // then respected by the fixed bottom nav.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SplashScreen />
        <AuthProvider>
          <AppStateProvider>
            <div className="mx-auto flex w-full max-w-7xl flex-1">
              <SideNav />
              <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-10">{children}</main>
              </div>
            </div>
            <BottomNav />
            <CompletionCelebration />
            <OnboardingFlow />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
