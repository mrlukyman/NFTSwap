import React from 'react'
import { useEnsAvatar } from 'wagmi'
import connectKit from 'connectkit'
import styled from 'styled-components'

const Wrapper = styled.button`
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
  border: none;
  outline: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 5rem;
  background: linear-gradient(160.61deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 101.7%);
  border-radius: 1rem;
  padding: 0 1rem;
  margin: 0.5rem 0;
  width: 100%;
  img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-right: 1rem;
  }
  &:hover {
    transition: all 0.2s ease-in-out;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    background: linear-gradient(160.61deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 101.7%);
    transform: scale(1.01);
    cursor: pointer;
  }
`

type ProfileSearchProps = {
  username: string
  walletAddress: `0x${string}` | undefined
  handleAddressSubmit: (e: React.MouseEvent<HTMLElement>, walletAddress: `0x${string}` | undefined, username: string) => void
}

export const ProfileSearchCard = ({ username, walletAddress, handleAddressSubmit }: ProfileSearchProps) => {
  const { data, isError, isLoading } = useEnsAvatar({
    //@ts-ignore
    address: walletAddress,
  })
  return (
    <Wrapper onClick={(e: React.MouseEvent<HTMLElement>) => handleAddressSubmit(e, walletAddress, username)}>
      <img src='https://picsum.photos/50' alt={username} />
      <p>@{username}</p>
    </Wrapper>
  )
}