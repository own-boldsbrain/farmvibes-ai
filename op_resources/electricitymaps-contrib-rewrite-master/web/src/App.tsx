import { ToastProvider } from '@radix-ui/react-toast';
import * as Sentry from '@sentry/react';
import { useGetAppVersion } from 'api/getAppVersion';
import LoadingOverlay from 'components/LoadingOverlay';
import Toast from 'components/Toast';
import LegendContainer from 'components/legend/LegendContainer';
import { OnboardingModal } from 'components/modals/OnboardingModal';
import ErrorComponent from 'features/error-boundary/ErrorBoundary';
import Header from 'features/header/Header';
import FAQModal from 'features/modals/FAQModal';
import InfoModal from 'features/modals/InfoModal';
import SettingsModal from 'features/modals/SettingsModal';
import TimeControllerWrapper from 'features/time/TimeControllerWrapper';
import { ReactElement, Suspense, lazy } from 'react';
import { Capacitor } from '@capacitor/core';
import trackEvent from 'utils/analytics';
import { Routes, Route } from 'react-router-dom';
import AnalyticsLayout from 'features/analytics/AnalyticsLayout';
import MacroView from 'features/analytics/MacroView';
import DuckCurveView from 'features/analytics/DuckCurveView';
import BialekView from 'features/analytics/BialekView';
import AiTerminalView from 'features/analytics/AiTerminalView';

const isProduction = import.meta.env.PROD;

if (isProduction) {
  trackEvent('App Loaded', {
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform(),
  });
}

const MapWrapper = lazy(async () => import('features/map/MapWrapper'));
const LeftPanel = lazy(async () => import('features/panels/LeftPanel'));
const handleReload = () => {
  window.location.reload();
};

export default function App(): ReactElement {
  const currentAppVersion = APP_VERSION;
  const { data, isSuccess } = useGetAppVersion();
  const latestAppVersion = data?.version || '0';
  const isNewVersionAvailable = isProduction && latestAppVersion > currentAppVersion;

  return (
    <Suspense fallback={<div />}>
      <main className="fixed flex h-screen w-screen flex-col">
        <ToastProvider duration={20_000}>
          <Routes>
            {/* Grid Analytics Engine Pages */}
            <Route path="/macro" element={<AnalyticsLayout activeView="macro"><MacroView /></AnalyticsLayout>} />
            <Route path="/duck-curve" element={<AnalyticsLayout activeView="duck-curve"><DuckCurveView /></AnalyticsLayout>} />
            <Route path="/bialek" element={<AnalyticsLayout activeView="bialek"><BialekView /></AnalyticsLayout>} />
            <Route path="/ai-terminal" element={<AnalyticsLayout activeView="ai-terminal"><AiTerminalView /></AnalyticsLayout>} />

            {/* Legacy Map Layout */}
            <Route path="*" element={
              <>
                <Header />
                <div className="relative flex flex-auto items-stretch">
                  <Sentry.ErrorBoundary fallback={ErrorComponent} showDialog>
                    {isSuccess && isNewVersionAvailable && (
                      <Toast
                        title="A new app version is available"
                        toastAction={handleReload}
                        isCloseable={true}
                        toastActionText="Reload"
                      />
                    )}
                    <LoadingOverlay />
                    <OnboardingModal />
                    <FAQModal />
                    <InfoModal />
                    <SettingsModal />
                    <LeftPanel />
                    <MapWrapper />
                    <TimeControllerWrapper />
                    <LegendContainer />
                  </Sentry.ErrorBoundary>
                </div>
              </>
            } />
          </Routes>
        </ToastProvider>
      </main>
    </Suspense>
  );
}
