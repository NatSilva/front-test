import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function createData(id,name, idade, estado_civil, cpf, cidade, estado) {
  return {
    id,
    name,
    idade,
    estado_civil,
    cpf,
    cidade, 
    estado,
  };
}


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Nome',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: false,
    label: 'Idade',
  },
  {
    id: 'estadi_civil',
    numeric: true,
    disablePadding: false,
    label: 'Estado Civil',
  },
  {
    id: 'cpf',
    numeric: true,
    disablePadding: false,
    label: 'CPF',
  },
  {
    id: 'cidade',
    numeric: true,
    disablePadding: false,
    label: 'Cidade',
  },
  {
    id: 'estado',
    numeric: true,
    disablePadding: false,
    label: 'Estado',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Ações',
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Pessoas
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function App() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('age');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const api = React.useCallback(async() => {
    await axios.get('http://localhost:3000/user/all')
      .then((response) => response.data)
      .then((data) => {
        setRows(data);
    });
  })

  //chamar o user effect toda vez que fizer uma requisição na api
  React.useEffect(() => {
    api();
  },[loading]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    axios.post('http://localhost:3000/user/register', {
      "name": Nome, 
      "age": Idade,
      "estado_civil": estado_civil,
      "cpf": Cpf,
      "cidade": Cidade,
      "estado": Estado,
    })
    setLoading(loading? false : true);
    setOpen(false);
  };
  
  const [Nome, setNome] = React.useState('');
  const [Idade, setIdade] = React.useState('');
  const [Cpf, setCpf] = React.useState('');
  const [estado_civil, setEstado_civil] = React.useState('');
  const [Cidade, setCidade] = React.useState('');
  const [Estado, setEstado] = React.useState('');
  //função de deletar que abre um dialogo de alerta
  const handleDelete = (user) => {
    const result = window.confirm('Deseja realmente excluir?');
    console.log(user.id)
    if (result) {
      axios.delete(`http://localhost:3000/user/delete/${user.id}`)
      .then(() => {
        setLoading(loading? false : true);
      })
    }
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Cadastrar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            value={Nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="age"
            label="Idade"
            type="number"
            fullWidth
            variant="standard"
            value={Idade}
            onChange={(e) => setIdade(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id='estados_civil'
            label="Estado Civil"
            type="text"
            fullWidth
            variant="standard"
            value={estado_civil}
            onChange={(e) => setEstado_civil(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id='cpf'
            label="CPF"
            type="text"
            fullWidth
            variant="standard"
            value={Cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id='cidade'
            label="Cidade"
            type="text"
            fullWidth
            variant="standard"
            value={Cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id='estado'
            label="Estado"
            type="text"
            fullWidth
            variant="standard"
            value={Estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose}>Adicionar</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.idade}</TableCell>
                      <TableCell align="right">{row.estado_civil}</TableCell>
                      <TableCell align="right">{row.cpf}</TableCell>
                      <TableCell align="right">{row.cidade}</TableCell>
                      <TableCell align="right">{row.estado}</TableCell>
                      <TableCell align="right"><DeleteIcon onClick={()=>handleDelete({
                        name: row.name, 
                        age: row.idade, 
                        estado_civil: row.estado_civil, 
                        cpf: row.cpf, 
                        cidade: row.cidade, 
                        estado: row.estado,
                        id: row.id
                      }
                      )}/><EditIcon/></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
