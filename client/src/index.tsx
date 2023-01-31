import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App'
import reportWebVitals from './reportWebVitals'
import { GlobalStyle } from './styles/GlobalStyles'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { WagmiConfig } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { wagmiClient } from './wagmi'



const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider>
        <ApolloProvider client={apolloClient}>
          <Provider store={store}>
            <BrowserRouter>
              <GlobalStyle />
              <App />
            </BrowserRouter>
          </Provider>
        </ApolloProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
