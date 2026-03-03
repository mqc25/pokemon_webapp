import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';

export const AuthScreen = ({ 
  isRegistering, setIsRegistering, 
  username, setUsername, 
  password, setPassword, 
  email, setEmail, 
  handleAuth, errors, setErrors 
}) => (
  <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5' }}>
    <Paper sx={{ p: 5, textAlign: 'center', width: 400 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {isRegistering ? 'CREATE ACCOUNT' : 'POKE-FINDER LOGIN'}
      </Typography>

      {errors.non_field_errors && <Alert severity="error" sx={{ mb: 2 }}>{errors.non_field_errors[0]}</Alert>}

      <TextField 
        fullWidth label="Username" sx={{ mb: 2 }} 
        error={!!errors.username}
        helperText={errors.username ? errors.username[0] : "Required."}
        onChange={(e) => setUsername(e.target.value)} 
      />

      {isRegistering && (
        <TextField 
          fullWidth label="Email" type="email" sx={{ mb: 2 }} 
          error={!!errors.email}
          helperText={errors.email ? errors.email[0] : "Required for registration."}
          onChange={(e) => setEmail(e.target.value)} 
        />
      )}

      <TextField 
        fullWidth label="Password" type="password" sx={{ mb: 3 }} 
        error={!!errors.password}
        helperText={errors.password ? errors.password[0] : "Min. 8 characters."}
        onChange={(e) => setPassword(e.target.value)} 
      />

      <Button variant="contained" fullWidth onClick={handleAuth}>
        {isRegistering ? 'Sign Up' : 'Enter Dashboard'}
      </Button>
      
      <Button variant="text" fullWidth sx={{ mt: 2, fontSize: '0.8rem' }} onClick={() => {setIsRegistering(!isRegistering); setErrors({});}}>
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </Button>
    </Paper>
  </Box>
);