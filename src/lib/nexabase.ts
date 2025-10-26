// lib/nexabase.ts
import { createNexaBaseClient } from '@nexabase/sdk';

const nexabase = createNexaBaseClient({
  baseURL: process.env.NEXT_PUBLIC_NEXABASE_URL!,
  apiKey: process.env.NEXT_PUBLIC_NEXABASE_API_KEY!,
});

export default nexabase;
