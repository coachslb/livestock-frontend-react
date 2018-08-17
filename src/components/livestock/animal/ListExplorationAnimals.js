import React, { Component } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell } from 'material-ui';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const row = (x, i, header, handleRemove, onEdit) => {
  return (
    <TableRow key={`tr-${i}`}>
      {header.map((y, k) => (
        <TableCell key={`trc-${k}`}>
          {y.prop !== 'birthDate'
            ? y.prop !== 'explorationType'
              ? x[y.prop]
              : x[y.prop].name
            : x[y.prop]
              ? x[y.prop].slice(0, 10)
              : ''}
        </TableCell>
      ))}
      <TableCell>
        <EditIcon onClick={() => onEdit(i)} />
        <DeleteIcon onClick={() => handleRemove(i)} />
      </TableCell>
    </TableRow>
  );
};

class ListExplorationAnimals extends Component {
  render() {
    const { header, data, handleRemove, onEdit, i18n } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            {header.map((x, i) => (
              <TableCell key={`thc-${i}`}>{x.name}</TableCell>
            ))}
            <TableCell>{i18n.general.actions}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{data.map(x => row(x, x.id, header, handleRemove, onEdit))}</TableBody>
      </Table>
    );
  }
}

export default ListExplorationAnimals;
