import React from "react";
import styled from 'styled-components'
import { Link } from "react-router-dom";

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
  return (
    <Wrapper>
      <NavItem to="/">Home</NavItem>
      <NavItem to="/trade">Trade</NavItem>
      <NavItem to="/profile">Profile</NavItem>
    </Wrapper>
  )
}