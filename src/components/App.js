import React, { Component } from 'react';
import './App.css';
import Routes from '../routes/index';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import amber from 'material-ui/colors/amber';

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
          <Routes />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
