import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Stack, useToast, IconButton, HStack,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import axiosInstance from '../../services/axios';

const Documents = () => {
  const [fileInputs, setFileInputs] = useState([{ id: 1, files: [] }]);
  const toast = useToast();

  const handleFileChange = (event, id) => {
    const files = event.target.files;
    setFileInputs(prevFileInputs =>
      prevFileInputs.map(fileInput =>
        fileInput.id === id ? { ...fileInput, files } : fileInput
      )
    );
  };

  const handleAddFileInput = () => {
    setFileInputs(prevFileInputs => [
      ...prevFileInputs,
      { id: prevFileInputs.length + 1, files: [] },
    ]);
  };

  const handleRemoveFileInput = (id) => {
    setFileInputs(prevFileInputs => prevFileInputs.filter(fileInput => fileInput.id !== id));
  };

  const handleUpload = async () => {
    const allFiles = fileInputs.flatMap(fileInput => Array.from(fileInput.files));

    if (allFiles.length === 0) {
      toast({
        title: 'No files selected',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    allFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axiosInstance.post('/music/upload/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Files Uploaded Successfully',
        status: 'success',
        isClosable: true,
        duration: 3000,
      });

      console.log(response.data);
    } catch (error) {
      toast({
        title: 'Error Uploading Files',
        description: error.message,
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
    }
  };

  return (
    <Box p={4} >
      <Stack spacing={4} w={{ base: '100%', lg: '50%' }} m="auto">
        {fileInputs.map((fileInput) => (
          <HStack key={fileInput.id} display="flex" alignItems="flex-end">
            <FormControl>
              <FormLabel color="primary.100">Upload File {fileInput.id}</FormLabel>
              <Input
                type="file"
                id={`file-upload-${fileInput.id}`}
                p={1}
                multiple
                onChange={(e) => handleFileChange(e, fileInput.id)}
                variant="filled"
                sx={{
                  '::file-selector-button': {
                    background: 'primary.100',
                    color: 'secondary.900',
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '5px',
                    marginX: '10px',
                    _hover: {
                      background: 'primary.900',
                    },
                    _active: {
                      background: 'primary.500',
                    },
                  },
                }}
              />
            </FormControl>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => handleRemoveFileInput(fileInput.id)}
              variant="ghost"
              aria-label="Remove file input"
            />
          </HStack>
        ))}
        <IconButton
          icon={<AddIcon />}
          onClick={handleAddFileInput}
          variant="ghost"
          aria-label="Add file input"
          alignSelf="flex-start"
        />
        <Button onClick={handleUpload} variant="solid" w={{base:"50%", 'lg':"20%"}}>
          Upload
        </Button>
      </Stack>
    </Box>
  );
};

export default Documents;
