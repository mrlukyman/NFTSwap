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
  margin: 3rem ;
`

export const Title = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  margin: 0 0 3rem 0;
`

export const LightText = styled.p`
  font-size: 1.563rem;
  font-weight: 100;
  margin: 0 0 2rem 0;
`

export const MediumText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`

export const Text = styled.p`
  font-size: 1.563rem;
  font-weight: 400;
  margin: 0 0 0.5rem 0;
`

export const SmallText = styled.p`
  font-size: 1.15rem;
  font-weight: 400;
  margin: 0.5rem 0;
  color: white;
`

export const Input = styled.input`
  width: 100%;
  height: 3rem;
  color: #fff;
  margin: 1rem 0;
  padding: 0 0.5rem;
  border-radius: 1rem;
  border: 1px solid #f71dfb54;
  background: ${Colors.cardBackground};
  font-size: 1rem;
  &:disabled {
    background: ${Colors.cardBackground};
    color: #ffffff88;
    border: none;
  }
  &:focus {
    outline: none;
    border: 1px solid #F81DFB;
    transition: 0.36s ease-out;
    transform: scale(1.01);
    box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
  }
`

export const Button = styled.button`
  transition: 0.36s ease-in-out;
  border-radius: 1rem;
  border: 1px solid #F81DFB;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
    -webkit-box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
    -moz-box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
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