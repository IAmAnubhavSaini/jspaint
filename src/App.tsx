import React from 'react';
import styled from 'styled-components';
import Canvas from "./components/Canvas";

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

    footer.footer {
      height: auto;
    }

    main.content {
      margin: 10vh 0;
      padding: var(--default-min-height) var(--default-min-width);
      height: 100vh;
      min-height: 20rem;
    }
  }
`;

const StyledCanvasContainer = styled.div`
  .canvas {
    height: 80vh;
    width: calc(100vw - 20px);
    zoom: 1;
    margin: 0 auto;
    display: block;
    box-shadow: 0 0 3px black;
  }
`;

function App() {
    return (
        <StyledAppContainer>
            <div className="app">
                <header className="header">
                    <h1>Welcome to jspaint!</h1>
                    <div className="tools">
                        Tools
                    </div>
                </header>
                <main className="content">
                    <StyledCanvasContainer>
                        <Canvas klass="canvas-first"/>
                    </StyledCanvasContainer>
                </main>
                <footer className="footer">
                    v2021.2.0
                </footer>
            </div>
        </StyledAppContainer>
    );
}

export default App;
