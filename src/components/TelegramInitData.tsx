// TelegramInitData.tsx
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

// Types
interface WebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
    auth_date?: string;
    hash?: string;
  };
}

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

interface ParsedInitData {
  user: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  } | null;
  startParam: string | null;
  authDate: string | null;
  hash: string | null;
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

const TelegramInitData: FC = () => {
  const [initData, setInitData] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedInitData | null>(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    
    if (tg) {
      const rawInitData = tg.initData;
      setInitData(rawInitData);
      
      // We can also directly access the parsed data from initDataUnsafe
      if (tg.initDataUnsafe) {
        setParsedData({
          user: tg.initDataUnsafe.user || null,
          startParam: tg.initDataUnsafe.start_param || null,
          authDate: tg.initDataUnsafe.auth_date || null,
          hash: tg.initDataUnsafe.hash || null
        });
      }
    }
  }, []);

  return (
    <Container>
      <Title>Telegram Init Data</Title>
      {parsedData ? (
        <DataContainer>
          {JSON.stringify(parsedData, null, 2)}
        </DataContainer>
      ) : (
        <NoDataText>No init data available</NoDataText>
      )}
    </Container>
  );
};

export default TelegramInitData;