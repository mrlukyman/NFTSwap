import { getDefaultClient } from 'connectkit'
import { createClient } from 'wagmi'
import { mainnet, polygon } from "wagmi/chains"
 
const chains = [polygon, mainnet];

const alchemyId = process.env.VITE_ALCHEMY_API_KEY;

export const wagmiClient = createClient(
  getDefaultClient({
    appName: "Your App Name",
    alchemyId,
    chains,
  }),
)
