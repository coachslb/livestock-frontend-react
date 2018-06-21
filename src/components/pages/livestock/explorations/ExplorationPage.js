import React, { Component, Fragment } from 'react';
import { CircularProgress } from 'material-ui';
import ExplorationService from '../../../../services/ExplorationService';
import EmptyExploration from '../../../livestock/exploration/EmptyExploration';

class ExplorationPage extends Component {

    constructor(){
        super();
        this.state = {
            hasData: null,
            serverError: null,
            isLoading: null
        }
    }

    componentDidMount(){
        this.setState({isLoading: true});
        const { id } = this.props.match.params;

        if (id) {
        const getExplorationsResponse = ExplorationService.get(null, id, true);

        getExplorationsResponse
            .then(res => {
                if(res.data.length > 0){
                    console.log(res);
                    this.setState({hasData: false, isLoading: false})
                }else
                    this.setState({hasData: false, isLoading: false})
            })
            .catch(err => this.setState({ serverError: true, isLoading: false }));
        }
    }

    render(){
        const { isLoading, hasData } = this.state;
        const { id } = this.props.match.params;
        return(
            <Fragment>
                {!hasData && !isLoading &&
                <EmptyExploration id={id}/>
                }
                {isLoading && <CircularProgress style={{height:'80px', width:'80px', top:"50%", left:"50%", position: 'absolute'}}/>}
            </Fragment>
        );
    }
}

export default ExplorationPage;