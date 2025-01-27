import { FC, useEffect, useState } from 'react';

// Extend the Window interface to include Telegram
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: any;
        platform: string;
        version: string;
        colorScheme: string;
        themeParams: Record<string, any>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        ready: () => void;
      };
    };
  }
}

import styled from 'styled-components';

// Types for parsed data
interface ParsedData {
  initDataUnsafe: Window['Telegram']['WebApp']['initDataUnsafe'];
  platform: string;
  version: string;
  colorScheme: string;
  themeParams: Record<string, any>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
}

const Container = styled.div`
  background-color: #2d2d2d;
  border-radius: 12px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: #ffffff;
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
`;

const DataContainer = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e0e0e0;
`;

const NoDataText = styled.p`
  color: #888888;
  font-style: italic;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-style: italic;
`;

const DebugInfo = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #333;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const TelegramInitData: FC = () => {
  const [initData, setInitData] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Window object:', window);
        setDebugInfo('Window object available. Checking for Telegram...');
      }

      const webapp = window.Telegram?.WebApp;
      if (!webapp) {
        setError('Telegram WebApp is not initialized. Make sure you\'re running this in Telegram.');
        setDebugInfo('Telegram object not found in window');
        return;
      }

      setDebugInfo(prev => prev + '\nTelegram object found. Getting WebApp...');

      // Store raw init data
      const rawInitData = webapp.initData;
      setInitData(rawInitData);

      if (process.env.NODE_ENV === 'development') {
        console.log('Complete WebApp object:', webapp);
      }

      // Store all available data for debugging
      const data: ParsedData = {
        initDataUnsafe: webapp.initDataUnsafe,
        platform: webapp.platform,
        version: webapp.version,
        colorScheme: webapp.colorScheme,
        themeParams: webapp.themeParams,
        isExpanded: webapp.isExpanded,
        viewportHeight: webapp.viewportHeight,
        viewportStableHeight: webapp.viewportStableHeight,
      };

      setParsedData(data);
      setDebugInfo(prev => prev + '\nData successfully parsed');

      // Call ready to tell Telegram we're good to go
      webapp.ready();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setDebugInfo(prev => prev + '\nError occurred: ' + errorMessage);
      console.error('Error initializing Telegram WebApp:', err);
    }
  }, []);

  return (
    <Container>
      <Title>Telegram Init Data</Title>
      {error ? (
        <>
          <ErrorText>{error}</ErrorText>
          {process.env.NODE_ENV === 'development' && (
            <DebugInfo>
              <pre>{debugInfo}</pre>
            </DebugInfo>
          )}
        </>
      ) : parsedData ? (
        <>
          <DataContainer>
            {JSON.stringify(parsedData, null, 2)}
          </DataContainer>
          {process.env.NODE_ENV === 'development' && (
            <DebugInfo>
              <pre>{debugInfo}</pre>
            </DebugInfo>
          )}
        </>
      ) : (
        <>
          <NoDataText>Loading Telegram data...</NoDataText>
          {process.env.NODE_ENV === 'development' && (
            <DebugInfo>
              <pre>{debugInfo}</pre>
            </DebugInfo>
          )}
        </>
      )}
    </Container>
  );
};

export default TelegramInitData;