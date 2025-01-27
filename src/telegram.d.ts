// src/telegram.d.ts

declare global {
    interface Window {
      Telegram: {
        WebApp: {
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
          platform: string;
          version: string;
          colorScheme: string;
          themeParams: {
            [key: string]: any;
          };
          isExpanded: boolean;
          viewportHeight: number;
          viewportStableHeight: number;
          ready: () => void;
        };
      };
    }
  }
  
  export {};