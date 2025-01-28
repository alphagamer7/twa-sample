import React, { useEffect, useState } from 'react';

// Define the TelegramWebApp and TelegramInitData interfaces
interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date: number;
    hash: string;
  };
  platform?: string;
  version?: string;
  colorScheme?: 'light' | 'dark';
  themeParams?: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
}

export interface TelegramInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  auth_date?: number;
  hash?: string;
  start_param?: string;
}

// // Declare the global Telegram object
// declare global {
//   interface Window {
//     Telegram?: {
//       WebApp: TelegramWebApp;
//     };
//   }
// }

const TelegramInitData: React.FC = () => {
  const [initDataRaw, setInitDataRaw] = useState<string | null>(null);
  const [initData, setInitData] = useState<TelegramInitData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const initializeTelegram = async (): Promise<void> => {
      try {
        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Attempting to retrieve Telegram launch parameters');
          setDebugInfo('Starting initialization...');
        }

        // Check if window.Telegram is available
        const webApp = window.Telegram?.WebApp;
        if (webApp) {
          const webAppData = webApp.initData;
          setInitDataRaw(webAppData);

          // Try to parse the init data if it exists
          if (webAppData) {
            try {
              const parsed = JSON.parse(webAppData) as TelegramInitData;
              setInitData(parsed);
              setDebugInfo((prev: string) => prev + '\nData successfully parsed');
            } catch (parseErr) {
              setInitData(null); // Store as null if parsing fails
              setDebugInfo((prev: string) => prev + '\nError parsing data: ' + String(parseErr));
            }
          }
        } else {
          throw new Error('Telegram WebApp is not available');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setDebugInfo((prev: string) => prev + '\nError: ' + errorMessage);
        console.error('Error:', err);
      }
    };

    void initializeTelegram();
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-5 m-2 shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-4">Telegram Init Data</h2>

      {error ? (
        <>
          <p className="text-red-400 italic">{error}</p>
          <div className="mt-4 p-3 bg-gray-900 rounded-lg text-sm">
            <pre>{debugInfo}</pre>
          </div>
        </>
      ) : initData ? (
        <>
          <div className="bg-gray-900 rounded-lg p-4 font-mono break-words text-gray-200">
            <h3 className="text-lg mb-2">Raw Init Data:</h3>
            <pre className="overflow-x-auto">{initDataRaw}</pre>
            <h3 className="text-lg mt-4 mb-2">Parsed Init Data:</h3>
            <pre className="overflow-x-auto">{JSON.stringify(initData, null, 2)}</pre>
          </div>
          <div className="mt-4 p-3 bg-gray-900 rounded-lg text-sm">
            <pre>{debugInfo}</pre>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-400 italic">Loading Telegram data...</p>
          <div className="mt-4 p-3 bg-gray-900 rounded-lg text-sm">
            <pre>{debugInfo}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default TelegramInitData;