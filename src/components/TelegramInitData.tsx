import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled Components
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
    // Function to initialize Telegram Web App
    const initTelegramApp = () => {
      try {
        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Attempting to initialize Telegram Web App');
          setDebugInfo('Starting initialization...');
        }

        // Wait for Telegram Web App to be available
        if (!window?.Telegram?.WebApp) {
          console.log('WebApp not found, waiting...');
          setTimeout(initTelegramApp, 1000);
          return;
        }

        const webapp = window.Telegram.WebApp;
        
        // Store raw init data
        const rawInitData = webapp.initData;
        setInitData(rawInitData);

        // Store all available data
        const data = {
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

        // Tell Telegram we're ready
        webapp.ready();
        
        // Log success in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Telegram Web App initialized:', data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setDebugInfo(prev => prev + '\nError: ' + errorMessage);
        console.error('Error:', err);
      }
    };

    // Start initialization
    initTelegramApp();

    // Cleanup
    return () => {
      // Any cleanup if needed
    };
  }, []);

  return (
    <Container>
      <Title>Telegram Init Data</Title>
      {error ? (
        <>
          <ErrorText>{error}</ErrorText>
          <DebugInfo>
            <pre>{debugInfo}</pre>
          </DebugInfo>
        </>
      ) : parsedData ? (
        <>
          <DataContainer>
            {JSON.stringify(parsedData, null, 2)}
          </DataContainer>
          <DebugInfo>
            <pre>{debugInfo}</pre>
          </DebugInfo>
        </>
      ) : (
        <>
          <NoDataText>Loading Telegram data...</NoDataText>
          <DebugInfo>
            <pre>{debugInfo}</pre>
          </DebugInfo>
        </>
      )}
    </Container>
  );
};

export default TelegramInitData;