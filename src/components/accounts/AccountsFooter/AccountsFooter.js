import React, { Component } from 'react';
import { InputLabel, Select, MenuItem, FormControl } from 'material-ui';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import FixedValuesService from '../../../services/FixedValuesService';
import '../../pages/accounts/accounts.css';

export default class AccountsFooter extends Component {

    constructor(){
        super();
        this.state = {
            languages: [],
            serverError: false,
            lang:'pt-PT'
        }

        this.onDialogClose = this.onDialogClose.bind(this);
        this.onLanguageChange = this.onLanguageChange.bind(this);
    }

    componentDidMount(){
        //Get languages List
        let languagesPromise = FixedValuesService.getLanguages();
        languagesPromise.then(res => {
            this.setState({ languages: res.data });
        }).catch((err) => {
            this.setState({ serverError: true })
        });
    }

    onLanguageChange(e) {
        this.setState({ lang: e.target.value });
        e.preventDefault();
    }

    onDialogClose(e) {
        this.setState({ errors: null, serverError: null });
    }

    render(){

        const { lang, serverError, languages } = this.state
        return(
            <div className="container-right--footer">
                <a href="https://www.agroop.net/en/privacy">Privacidade</a>
                <a href="https://www.agroop.net/en/privacy/terms/">Termos</a>
                <FormControl>
                    <InputLabel>Língua</InputLabel>
                    <Select
                        name="lang"
                        value={lang !== '' ? lang : 'pt-PT'}
                        onChange={this.onLanguageChange}
                    >
                        {languages.map(lang => {
                        return (
                            <MenuItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </MenuItem>
                        );
                        })}
                    </Select>
                </FormControl>
                {serverError && (
                <ErrorDialog
                title="Server Error"
                text="There are some server problem"
                onDialogClose={this.onDialogClose}
                />
                )}
            </div>
        );
    }
    
}