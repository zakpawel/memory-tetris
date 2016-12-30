import React from 'react';
import styled from 'styled-components';

export default styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background-color: ${props => props.color ? props.color : 'yellow'};
  border: ${props => props.borderss ? props.borderss : '1px solid rgba(0, 0, 0, 0.46);'};
`;
