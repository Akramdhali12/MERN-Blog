import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  //server er port ta add korlam 
  server:{
    proxy:{
      '/api':{
        target: 'http://localhost:3000',
        secure:false,
      },
    },
  },
  //End
  plugins: [react()],
})
