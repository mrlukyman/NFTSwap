import React from "react";
import styled from 'styled-components'
import { Link } from "react-router-dom"
import { useModal } from 'connectkit'
import { useSelector } from "react-redux"
import { ConnectKitButton } from "connectkit"

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(20.8333px);
  position: fixed;
  right: 50%;
  transform: translate(50%, -4px);
  border-radius: 0 0 15px 15px;
  z-index: 100;
`

const NavItem = styled(Link)`
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  margin: 0 1rem;
  cursor: pointer;
  text-decoration: none;
`


export const Nav = () => {
  const isLoggedin = useSelector((state: any) => state.user.isLoggedin)
  return (
    <>
      {isLoggedin ? (
        <Wrapper>
          <NavItem to="/">Home</NavItem>
          <NavItem to="/trade">Trade</NavItem>
          <NavItem to="/profile">Profile</NavItem>
        </Wrapper>
      ) : (
        <Wrapper>
          <ConnectKitButton.Custom>
            {({ show }) => {
              return (
                <>
                  <NavItem to='/'>Home</NavItem>
                  <NavItem onClick={show} to='/'>Trade</NavItem>
                  <NavItem onClick={show} to='/'>Profile</NavItem>
                </>
              )
            }}
          </ConnectKitButton.Custom>
        </Wrapper>

      )}
    </>

  )
}