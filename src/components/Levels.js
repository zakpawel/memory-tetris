import React from 'react';
import styled from 'styled-components';
import Info from '../components/Info';

const LevelsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoStyled = styled.span`
`;

export default ({ current, available, onSelect }) => {
  return (
    <Container>
      <Info>
        Level:
      </Info>
      <LevelsContainer>
        { available.map((level, idx) => {
          return (
            <Level
              key={idx}
              active={current === level}
              onClick={() => onSelect(level)}
            >
              {level}
            </Level>
          );
        })}
      </LevelsContainer>
    </Container>
  );
}

const Level = styled.div`
  flex: 1 1 50%;
  text-align: center;
  background-color: ${props => props.active ? 'gold': 'transparent'};
`;
