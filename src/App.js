import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Main from './Main';
import Login from './Login';
import { ToastContainer} from 'react-toastify';
function App() {
  return <>
   <BrowserRouter>
   <ToastContainer/>
   <Routes>
    <Route path='/' element={<Main/>}></Route>
    <Route path='/Login' element={<Login/>}></Route>
    </Routes>
   </BrowserRouter>
  </>
}

export default App;
