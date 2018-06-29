import React, { Fragment, Component } from 'react';
import {
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Input,
  Button,
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

class EditExplorationPage extends Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      agricolaEntityId: 0,
      name: '',
      addressId: '',
      address: '',
      postalCode: '',
      district: '',
      explorationTypes: [],
      isLoading: false,
      serverError: false,
      errors: null,
      types: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    let getOneExplorationPromise = ExplorationService.get(this.props.match.params.id, null, true);

    let explorationTypePromise = FixedValuesService.getExplorationTypes(true);
    explorationTypePromise
      .then(res => {
        this.setState({ explorationTypes: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    getOneExplorationPromise
      .then(res => {
        this.setState({
          id: res.data.id ? res.data.id : '',
          agricolaEntityId: res.data.agricolaEntityId ? res.data.agricolaEntityId : '',
          addressId: res.data.address && res.data.address.id ? res.data.address.id : '',
          address: res.data.address && res.data.address.detail ? res.data.address.detail : '',
          district: res.data.address && res.data.address.district ? res.data.address.district : '',
          postalCode:
            res.data.address && res.data.address.postalCode ? res.data.address.postalCode : '',
          name: res.data.name ? res.data.name : '',
          types: res.data.explorationTypes ? res.data.explorationTypes.map(elem => elem.name) : '',
          isLoading: false,
        });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onDialogClose = e => {
    this.setState({ errors: null, serverError: null });
    e.preventDefault();
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  };

  onCancel = e => {
    const entityId = this.props.match.params.entityId;
    const id = this.props.match.params.id;
    this.props.history.push(`/livestock/explorations/${entityId}/detail/${id}`);
  };

  onSave = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const {
      id,
      name,
      agricolaEntityId,
      addressId,
      address,
      postalCode,
      district,
      types,
    } = this.state;

    let errors = ExplorationValidations.validateCreateOrUpdateExploration(name, types);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      let explorationTypeIds = types.map(
        elem => this.state.explorationTypes.find(exp => exp.name === elem).id,
      );
      let updateExplorationResponse = ExplorationService.updateExploration(
        {
          id,
          agricolaEntityId,
          name,
          address: {
            id: addressId,
            detail: address,
            district,
            postalCode,
          },
          explorationTypes: explorationTypeIds,
        },
        true,
      );

      updateExplorationResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(
            `/livestock/explorations/${agricolaEntityId}/detail/${res.data.id}`,
          );
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  render() {
    console.log(this.state);
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
                        <Checkbox
                          color="primary"
                          checked={this.state.types.indexOf(explorationType.name) > -1}
                        />
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
                onClick={this.onSave}
              >
                Save
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

export default EditExplorationPage;
