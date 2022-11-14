import { createGlobalStyle } from "styled-components"
import styled from 'styled-components'
import { Colors } from './Colors'

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${Colors.background};
    color: #fff;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 5rem;
`

export const SectionTitle = styled.h1`
  font-size: 6.25rem;
  font-weight: 600;
  margin: 3rem O;
`

export const Title = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  margin: 0 0 3rem 0;
`

export const LightText = styled.p`
  font-size: 1.563rem;
  font-weight: 100;
  margin: 0 0 3rem 0;
`

export const DarkText = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
`

export const Text = styled.p`
  font-size: 1.563rem;
  font-weight: 400;
  margin: 0;
`

export const SmallText = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
  color: white;
`

export const Button = styled.button`
  transition: 0.36s ease-in;
  border-radius: 15px;
  border: 1px solid #F81DFB;
  &:hover {
    ;
    background: ${Colors.primary};
  }
`

export const Blur = styled.div`
  position: absolute;
  left: -20rem;
  height: 20rem;
  width: 30rem;
  z-index: -1;
  transform: translate(0, -10rem);
  background: ${Colors.primary};
  opacity: 0.75;
  filter: blur(229.167px);
`