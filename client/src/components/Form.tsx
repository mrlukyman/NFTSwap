import React, { useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'

const CREATE_USER = gql`
  mutation createUser($email: String!, $username: String!, $name: String!, $walletAddress: String!) {
    createUser(email: $email, username: $username, name: $name, walletAddress: $walletAddress) {
      email
      username
      name
      walletAddress
    }
  }
`

interface Props {
  address: string
}

export const Form = ({ address }: Props) => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
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
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="walletAddress"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}