import React, { Component } from 'react';
import './App.css';
import LoginPage from './pages/login/LoginPage';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import amber from 'material-ui/colors/amber'

class App extends Component {

  render() {
    const theme = createMuiTheme({
      palette: {
        primary: amber,
      },
    });

    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <LoginPage name={"José Garção"}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
