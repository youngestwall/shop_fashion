import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, InputBase, IconButton } from '@mui/material';
import { Search, Close } from '@mui/icons-material';

const SearchBar = ({ onClose }) => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
      if (onClose) onClose();
    } else {
      navigate('/products');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <InputBase
        placeholder="Tìm kiếm sản phẩm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ ml: 1, flex: 1, p: 1 }}
      />
      <IconButton type="submit" aria-label="search">
        <Search />
      </IconButton>
      {onClose && (
        <IconButton aria-label="close search" onClick={onClose}>
          <Close />
        </IconButton>
      )}
    </Box>
  );
};

export default SearchBar;
