import React, { Component } from 'react';
import './App.css';
import Routes from '../routes/index';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import amber from 'material-ui/colors/amber';
import allI18n from './utils/i18n';

export const I18nContext = React.createContext();

const language = localStorage.getItem('language') || 'pt-PT';
class App extends Component {
  state = {
    language,
    allI18n,
    i18n: allI18n[language],
    changeLanguage: language => {
      this.setState({ language, i18n: allI18n[language] });
      localStorage.setItem('language', language);
    },
  };
  render() {
    const theme = createMuiTheme({
      palette: {
        primary: amber,
      },
    });

    return (
      <MuiThemeProvider theme={theme}>
        <I18nContext.Provider value={this.state}>
          <div className="App">
            <Routes />
          </div>
        </I18nContext.Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
