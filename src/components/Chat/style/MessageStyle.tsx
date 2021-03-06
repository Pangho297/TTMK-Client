import styled, {css} from 'styled-components';

export const Container = styled.div<{isMine: boolean}>`
  display: flex;
  align-items: flex-end;
  
  ${(props) => props.isMine ? css`
    flex-direction: row-reverse;
  ` : `
    flex-direction: row;
  `}
`;

export const Text = styled.span<{isMine: boolean}>`
  font-size: 1rem;
  margin: 1rem;
  padding: 0.5rem;
  border-radius: 2rem;
  line-height: 30px;
  ${(props) => props.isMine ? css`
    background-color: #4EBDC9;
    color: #FFFFFF;
  ` : `
    background-color: #FFFFFF;
  `}
`;
 
//div 높이와 line-height 높이를 같게하면 글자는 line-height 가운데 위치하게 된다.
export const Time = styled.div`
  font-size: 0.8rem;
  line-height: 4rem;
  min-width: 70px;
`;