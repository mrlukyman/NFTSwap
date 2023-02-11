import styled from 'styled-components'
import { LightText } from '../styles/GlobalStyles'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 20rem;
  margin-top: 5rem;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.08) 10%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(5rem);
`

export const Footer = () => {
  return (
    <Wrapper>
      <LightText>Created by @lukasharing</LightText>
    </Wrapper>
  )
}