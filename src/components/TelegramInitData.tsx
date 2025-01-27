import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

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
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    try {
      // Log window object in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Window object:', window);
        setDebugInfo('Window object available. Checking for Telegram...');
      }

      // Check if we're in Telegram environment
      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        setError('Telegram WebApp is not initialized. Make sure you\'re running this in Telegram.');
        setDebugInfo('Telegram object not found in window');
        return;
      }

      setDebugInfo(prev => prev + '\nTelegram object found. Getting WebApp...');

      const tg = window.Telegram.WebApp;

      if (tg) {
        setDebugInfo(prev => prev + '\nWebApp found. Getting data...');

        // Store raw init data
        const rawInitData = tg.initData;
        setInitData(rawInitData);

        // Log complete WebApp object in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Complete WebApp object:', tg);
        }

        // Store all available data for debugging
        const data = {
          initDataUnsafe: tg.initDataUnsafe,
          platform: tg.platform,
          version: tg.version,
          colorScheme: tg.colorScheme,
          themeParams: tg.themeParams,
          isExpanded: tg.isExpanded,
          viewportHeight: tg.viewportHeight,
          viewportStableHeight: tg.viewportStableHeight,
        };

        setParsedData(data);
        setDebugInfo(prev => prev + '\nData successfully parsed');

        // Call ready to tell Telegram we're good to go
        tg.ready();
      } else {
        setError('Telegram WebApp is not available');
        setDebugInfo(prev => prev + '\nWebApp object not found in Telegram');
      }
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