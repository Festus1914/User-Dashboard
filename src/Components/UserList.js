import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../queries';
import { TextField, MenuItem, Modal, Box, Typography, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import Pagination from '@mui/material/Pagination';
import { Fade } from '@mui/material';

const UserList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, loading, error } = useQuery(GET_USERS, {
    variables: { page, limit: 10, sort },
    fetchPolicy: 'cache-and-network',
  });

  const handleSearch = (e) => setSearch(e.target.value);
  const handleSort = (e) => setSort(e.target.value);

  const filteredUsers = data?.users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading) return <Typography variant="h6" className="text-center mt-8">Loading...</Typography>;
  if (error) return <Typography color="error" className="text-center mt-8">Error: {error.message}</Typography>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <TextField
              label="Search users"
              variant="outlined"
              value={search}
              onChange={handleSearch}
              className="w-full"
              InputProps={{
                startAdornment: <div className="w-10"></div>,
                className: "pl-10 rounded-full",
              }}
            />
          </div>
          <div className="flex items-center">
            <SortIcon className="mr-2 text-gray-600" />
            <TextField
              select
              label="Sort By"
              value={sort}
              onChange={handleSort}
              variant="outlined"
              className="min-w-[150px]"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="company">Company</MenuItem>
            </TextField>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map(user => (
            <li
              key={user.id}
              className="p-6 hover:bg-gray-50 cursor-pointer transition duration-300 ease-in-out"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-xl text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <Chip label={user.company.name} color="primary" variant="outlined" />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Pagination
        count={Math.ceil(data?.totalUsers / 10)}
        page={page}
        onChange={(event, value) => setPage(value)}
        className="mt-8 flex justify-center"
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'text.primary',
            fontWeight: 'medium',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      />
      <Modal
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        closeAfterTransition
        aria-labelledby="user-modal-title"
        aria-describedby="user-modal-description"
      >
        <Fade in={Boolean(selectedUser)}>
          <Box 
            sx={{
              p: 6, 
              bgcolor: 'background.paper', 
              borderRadius: 4, 
              boxShadow: 24, 
              mx: 'auto', 
              mt: 10, 
              maxWidth: 500, 
              width: '90%',
              position: 'relative',
              outline: 'none',
            }}
          >
            <IconButton 
              sx={{ position: 'absolute', top: 16, right: 16, color: 'grey.700' }} 
              onClick={() => setSelectedUser(null)}
              aria-label="close"
            >
              <CloseIcon fontSize="large" />
            </IconButton>
            <Typography 
              id="user-modal-title" 
              variant="h4" 
              component="h2" 
              sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}
            >
              {selectedUser?.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
              <strong>Email:</strong> {selectedUser?.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
              <strong>Phone:</strong> {selectedUser?.phone}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
              <strong>Company:</strong> {selectedUser?.company.name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              <strong>Address:</strong> {selectedUser?.company.address}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default UserList;