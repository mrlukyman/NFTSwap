import { Avatar } from 'connectkit'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { NftList } from "../components/NftList"
import { Container } from '../styles/GlobalStyles'
import { Text } from '../styles/GlobalStyles'
import { RegistrationForm } from '../components/RegistrationForm'
import profile_background from '../assets/profile_background.png'
import { Footer } from '../components/Footer'

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`

export const Register = () => {
  return (
    <>
      <Container>
        <Header />
        <FormWrapper>
          <RegistrationForm />
        </FormWrapper>
      </Container>
      <Footer />
    </>
  )
}
