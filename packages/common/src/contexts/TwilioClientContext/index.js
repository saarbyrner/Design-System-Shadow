// @flow
import { type Node, createContext, useContext, useState } from 'react';
import { type Client } from '@twilio/conversations';

type TwilioClientContextType = {
  twilioClient: Client | null,
  setTwilioClient: (client: Client | null) => void,
};

export const DEFAULT_CONTEXT_VALUE = {
  twilioClient: null,
  setTwilioClient: () => {},
};

const TwilioClientContext = createContext<TwilioClientContextType>(
  DEFAULT_CONTEXT_VALUE
);

type ProviderProps = {
  children: Node,
};

const TwilioClientProvider = ({ children }: ProviderProps) => {
  const [twilioClient, setTwilioClient] = useState<Client | null>(null);

  return (
    <TwilioClientContext.Provider value={{ twilioClient, setTwilioClient }}>
      {children}
    </TwilioClientContext.Provider>
  );
};

export const useTwilioClient = () => useContext(TwilioClientContext);

export { TwilioClientProvider };
export default TwilioClientContext;
