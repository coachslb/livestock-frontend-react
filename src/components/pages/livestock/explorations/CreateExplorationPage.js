import React, { Component, Fragment } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox,
  ListItemText,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ExplorationService from '../../../../services/ExplorationService';
import FixedValuesService from '../../../../services/FixedValuesService';
import ExplorationValidations from '../../../../validations/ExplorationValidations';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class CreateExplorationPage extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      address: '',
      postalCode: '',
      district: '',
      explorationTypes: [],
      explorationTypeIds: [],
      isLoading: false,
      serverError: false,
      errors: null,
      types: [],
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    let explorationTypePromise = FixedValuesService.getExplorationTypes(true);
    explorationTypePromise
      .then(res => {
        this.setState({ explorationTypes: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  };

  onCreate = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const {name, address, postalCode, district, types} = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdateExploration(name, types);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      let explorationTypeIds = types.map(elem => this.state.explorationTypes.find(exp => exp.name === elem).id);
      let createExplorationResponse = ExplorationService.createExploration({
        agricolaEntityId: this.props.match.params.id,
        name,
        address:{
          detail: address,
          district,
          postalCode
        },
        explorationTypes: explorationTypeIds
      }, true);

      createExplorationResponse.then((res)=>{
        this.setState({isLoading: false})
        this.props.history.push(`/livestock/explorations/${this.props.match.params.id}/detail/${res.data.id}`);
      }).catch((err) => {
        this.setState({ serverError: true, isLoading: false })
      });
    }
  }; 

  onCancel = e => {
    const id = this.props.match.params.id;
    this.props.history.push(`/livestock/explorations/${id}`);
  };

  render() {
    const { isLoading, explorationTypes, errors, serverError } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Card>
            <CardContent>
              <div className="card-header">
                <Typography variant="headline" className="card-header_title">
                  Exploração
                </Typography>
              </div>
              <div className="card-body">
                <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                  <InputLabel>Name</InputLabel>
                  <Input name="name" value={this.state.name} onChange={this.handleChange} />
                </FormControl>
                <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                  <InputLabel htmlFor="select-multiple-checkbox">Tipo de exploração*</InputLabel>
                  <Select
                    multiple
                    name="types"
                    value={this.state.types}
                    onChange={this.handleChange}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {explorationTypes.map(explorationType => (
                      <MenuItem key={explorationType.id} value={explorationType.name}>
                        <Checkbox color="primary" checked={this.state.types.indexOf(explorationType.name) > -1} />
                        <ListItemText primary={explorationType.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                  <InputLabel>Morada</InputLabel>
                  <Input name="address" value={this.state.address} onChange={this.handleChange} />
                </FormControl>
                <FormControl style={{ width: '30%', margin: '10px', marginBottom: '40px' }}>
                  <InputLabel>Distrito</InputLabel>
                  <Input name="district" value={this.state.district} onChange={this.handleChange} />
                </FormControl>
                <FormControl style={{ width: '15%', margin: '10px', marginBottom: '40px' }}>
                  <InputLabel>Código postal</InputLabel>
                  <Input
                    name="postalCode"
                    value={this.state.postalCode}
                    onChange={this.handleChange}
                  />
                </FormControl>
              </div>
            </CardContent>
            <div className="card-actions">
              <Button
                size="medium"
                variant="raised"
                color="primary"
                className="card-button"
                onClick={this.onCancel}
              >
                Cancelar
              </Button>
              <Button
                size="medium"
                variant="raised"
                color="primary"
                className="card-button"
                onClick={this.onCreate}
              >
                Criar
              </Button>
            </div>
          </Card>
        )}
        {errors && (
          <ErrorDialog
            title="Input Errors"
            text="There are some input errors"
            onDialogClose={this.onDialogClose}
          />
        )}
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There are some server problem"
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default CreateExplorationPage;
