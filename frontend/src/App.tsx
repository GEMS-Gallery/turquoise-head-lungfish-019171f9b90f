import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, Card, CardContent, Fab, Modal, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string | null;
  timestamp: bigint;
};

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://loremflickr.com/g/1200/400/crypto?lock=1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  marginBottom: theme.spacing(4),
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
}));

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (data: { title: string; body: string; author: string }) => {
    try {
      await backend.createPost(data.title, data.body, data.author ? [data.author] : []);
      setIsModalOpen(false);
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Box>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Explore the latest in cryptocurrency and blockchain technology
        </Typography>
      </HeroSection>

      <Container>
        {posts.map((post) => (
          <Card key={Number(post.id)} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {post.body}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {post.author ? `By ${post.author}` : 'Anonymous'} | 
                {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>

      <StyledFab color="primary" aria-label="add" onClick={() => setIsModalOpen(true)}>
        <AddIcon />
      </StyledFab>

      <StyledModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="create-post-modal"
      >
        <ModalContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Create New Post
          </Typography>
          <form onSubmit={handleSubmit(handleCreatePost)}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="body"
              control={control}
              defaultValue=""
              rules={{ required: 'Body is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Body"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="author"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Author (optional)"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Create Post
            </Button>
          </form>
        </ModalContent>
      </StyledModal>
    </Box>
  );
}

export default App;
