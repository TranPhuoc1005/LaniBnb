import { useRoutes } from 'react-router-dom';
import './App.css';
import { routes } from './routes';
import ScrollToTop from './components/layout/ScrollToTop';


function App() {
  const routerElements = useRoutes(routes);
  return (
    <>
      <ScrollToTop />
      {routerElements}
      
    </>
  )
}

export default App
