import React from 'react';
import styled from 'styled-components';

const StyledAppContainer = styled.div`
  .app {
    padding: var(--default-height) 0;

    header.header,
    footer.footer {
      position: fixed;
      bottom: 0;
      width: 100vw;
      background-color: var(--primary-bgcolor);
      height: 10vh;
      min-height: 2rem;
      text-align: center;
    }

    header.header {
      height: 10vh;
      min-height: 3rem;
      top: 0;
    }

    main.content {
      margin: 10vh 0;
      padding: var(--default-min-height) var(--default-min-width);
      height: 100vh;
      min-height: 20rem;
    }
  }
`;

function App() {
    return (
        <StyledAppContainer>
            <div className="app">
                <header className="header">
                    <h1>Welcome to jspaint!</h1>
                </header>
                <main className="content">
                    Where are we now?
                </main>
                <footer className="footer">
                    v2021.2.0
                </footer>
            </div>
        </StyledAppContainer>
    );
}

export default App;
