import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

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
  const [initDataRaw, setInitDataRaw] = useState<string | null>(null);
  const [initData, setInitData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    try {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Attempting to retrieve Telegram launch parameters');
        setDebugInfo('Starting initialization...');
      }

      // Retrieve launch parameters
      const { initDataRaw, initData } = retrieveLaunchParams();
      console.log('initDataRaw:', initDataRaw);
      console.log('initData:', initData);

      // Store raw init data
      setInitDataRaw(initDataRaw as string);
      setInitData(initData);

      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Telegram launch parameters retrieved:', { initDataRaw, initData });
        setDebugInfo('Data successfully retrieved');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setDebugInfo(prev => prev + '\nError: ' + errorMessage);
      console.error('Error:', err);
    }
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
      ) : initData ? (
        <>
          <DataContainer>
            <h3>Raw Init Data:</h3>
            <pre>{initDataRaw}</pre>
            <h3>Parsed Init Data:</h3>
            <pre>{JSON.stringify(initData, null, 2)}</pre>
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