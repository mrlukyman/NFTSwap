import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { userActions } from '../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Button } from '../styles/GlobalStyles'
import { Colors } from '../styles/Colors'

const CREATE_USER = gql`
  mutation createUser($email: String!, $username: String!, $name: String!, $walletAddress: String!) {
    createUser(email: $email, username: $username, name: $name, walletAddress: $walletAddress) {
      id
      email
      username
      name
      walletAddress
    }
  }
`

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25rem;
  margin: 2rem;
`

const Input = styled.input`
  width: 100%;
  height: 3rem;
  color: #fff;
  margin: 10px 0;
  padding: 0 10px;
  border-radius: 15px;
  border: 1px solid #F81DFB;
  background: ${Colors.cardBackground};
  border-radius: 5px;
  font-size: 16px;
  &:disabled {
    background: ${Colors.cardBackground};
    color: #ffffff88;
    border: none;
  }
`

const RegisterButton = styled(Button)`
  transition: 0.36s ease-in;
  border-radius: 15px;
  border: 1px solid #F81DFB;
  height: 3rem;
  width: 10rem;
  background: ${Colors.cardBackground};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  &:hover {
    box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
    -webkit-box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
    -moz-box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
  }
`

export const Form = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const address = useSelector((state: any) => state.user.user.walletAddress)
  const [walletAddress, setWalletAddress] = useState(address)

  const [createUser] = useMutation(CREATE_USER)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    createUser({
      variables: {
        email,
        username,
        name,
        walletAddress,
      },
    })
      .then(({ data }) => {
        dispatch(userActions.login({
          email: data.createUser.email,
          username: data.createUser.username,
          name: data.createUser.name,
          walletAddress: data.createUser.walletAddress
        }))
      })
      .catch((err) => {
        console.log(err)
      }
      )
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <h1>Register</h1>
      <Input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="text"
        placeholder="walletAddress"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        disabled
      />
      <RegisterButton type="submit">Submit</RegisterButton>
    </FormWrapper>
  )
}