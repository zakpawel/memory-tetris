import React from 'react';
import styled from 'styled-components';

const Anchor = styled.a`
  display: block;
`;

const Button = styled.div`

`;

export default ({ onClick, children }) => {
  return (
    <Button onClick={onClick}>
      <Anchor>{children}</Anchor>
    </Button>
  );
}
