import React from 'react';
import styled from 'styled-components';
import Info from '../components/Info';

const Counter = styled.div`
  display: flex;
  flex-direction: column;
`;

export default ({ children }) => {
  return (
    <Counter>
      <Info>
        Time left:
      </Info>
      { children }
    </Counter>
  );
}
