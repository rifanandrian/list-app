import Head from 'next/head';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import Moment from 'react-moment';

export default function Home() {
  const [state, setState] = useState({
    users: [],
    page: 0,
    rowsPerPage: 5,
    filter: '',
    gender: 'all'
  });
  const { users, page, filter, rowsPerPage, gender } = state;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('username');

  const headTable = [
    {
      id: 'username',
      label: 'Username',
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'gender',
      label: 'Gender',
    },
    {
      id: 'register_date',
      label: 'Register Date',
    },
  ];

  const fetchData = async (page, size, gender, keywords, sortBy, sortOrder) => {
    try {
      await fetch(`https://randomuser.me/api/?page=${!!page ? page : 0}&size=${!!size ? size : 5}&pageSize=10&results=10${!!gender ? `&gender=${gender}` : ''}${!!keywords ? `&keywords=${keywords}` : ''}${!!sortBy ? `&sortBy=${sortBy}` : ''}${!!sortOrder ? `&sortOrder=${sortOrder}` : ''}`)
        .then((response) => response.json())
        .then((data) => {
          const results = data.results.map(res => ({
            username: res.login.username,
            name: res.name.first + ' ' + res.name.last,
            email: res.email,
            gender: res.gender,
            register_date: res.registered.date
          }));
          setState({ users: results, rowsPerPage: !!size ? size : 5, page: !!page ? page : 0, gender: gender })
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(0, 5);
  }, []);

  const handleChangePage = (event, newPage) => {
    fetchData(newPage, rowsPerPage);
    setState({...state, page: newPage})
  };

  const handleChangeRowsPerPage = (event) => {
    fetchData(0, parseInt(event.target.value, 10));
    // setState({...state, rowsPerPage: parseInt(event.target.value, 10)})
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    fetchData(page, rowsPerPage, gender, filter, property, isAsc ? 'descend' : 'ascend')
  };

  const handleGenderChange = (event) => {
    setState({...state, gender: event.target.value});
    fetchData(page, rowsPerPage, event.target.value !== 'all' ? event.target.value : null);
  };

  const handleResetFiter = () => {
    setState({...state, gender: 'all', filter: ''});
    fetchData(page, rowsPerPage)
  };

  const handleInputFilter = (event) => {
    setState({...state, gender: 'all', filter: event.target.value});
  };

  const searchInput = () => {
    fetchData(page, rowsPerPage, gender !== 'all' ? gender : null, filter)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <div className={styles.filter_holder}>
              <input className={styles.input} type="text" value={filter} onKeyUp={handleInputFilter} />
              <Button variant="contained" onClick={searchInput}>Search</Button>

              <select
                className={styles.select}
                placeholder='Gender'
                value={gender}
                label="gender"
                onChange={handleGenderChange}
              >
                <option value={'all'}>All</option>
                <option value={'male'}>Male</option>
                <option value={'female'}>Female</option>
              </select>
              <Button className={styles.ml} variant="outlined" onClick={handleResetFiter}>Reset Filter</Button>

            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headTable.map((headTable) => (
                      <TableCell
                        key={headTable.id}
                        align={'left'}
                        padding={'normal'}
                        sortDirection={orderBy === headTable.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headTable.id}
                          direction={orderBy === headTable.id ? order : 'asc'}
                          onClick={() => handleRequestSort(headTable.id)}
                        >
                          {headTable.label}
                          {orderBy === headTable.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc'
                                ? 'sorted descending'
                                : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => {
                      return (
                        <TableRow hover key={index}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.gender}</TableCell>
                          <TableCell><Moment format="DD/MM/YYYY">{user.register_date}</Moment></TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </main>

    </div>
  );
}
