import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { userActions } from '../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Button } from '../styles/GlobalStyles'
import { Colors } from '../styles/Colors'
import { useNavigate } from 'react-router-dom'
import { useGetUser } from '../api/hooks/useGetUser'
import { Input } from '../styles/GlobalStyles'

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
  width: 30rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin:2rem;
`

const RegisterButton = styled(Button)`
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
    cursor: pointer;
    box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
    -webkit-box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
    -moz-box-shadow: 0px 0px 1rem 0px rgba(248,29,251,0.75);
    transition: 0.36s ease-in;
    transform: scale(1.01);
  }
`

export const RegistrationForm = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const address = useSelector((state: any) => state.user.user.walletAddress)
  const [walletAddress, setWalletAddress] = useState(address || '')
  const navigate = useNavigate()
  const { getUser } = useGetUser()


  const [createUser] = useMutation(CREATE_USER)

  const handleSubmit = (e: any) => {
    if (!email || !username || !name || !walletAddress) return ( //TODO: add better validation of each input field
      alert('Please fill all the fields')
    )
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
      })
    navigate('/profile') //TODO: make this not glitchy
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