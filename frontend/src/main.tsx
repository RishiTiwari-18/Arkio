import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { Provider } from "react-redux"
import { store } from './app/app.store.ts'
import { Toaster } from './components/ui/sonner.tsx'


createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
      <Provider store={store}>
        <Toaster/>
        <App />
      </Provider>
    </ThemeProvider>
)
