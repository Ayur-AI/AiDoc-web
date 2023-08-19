import React from 'react'
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'
import { toast,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {auth} from './firebase'
import {signInWithEmailAndPassword} from 'firebase/auth'
// import { setAuthToken } from './setAuthToken';
function Login() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [email,setEmail]=React.useState('')
    const [password,setPassword]=React.useState('')
    const [Doctor,setDoctor]=React.useState('')
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    
    const Navigate=useNavigate()
    
//     let handleProfile=async()=>{
//       try{
//         let doctorid=sessionStorage.getItem('Doctorid')
//         let res=await axios.post('https://api.ayurai.in/api/data/getDoctor',{
//            UID:doctorid
//         })

//         if(res.status===200){
//           let id=res.data
//           if(id){
//             data.getDoctors(id)
//             sessionStorage.setItem('Ayurdocid',id.Data.PID)
//             Navigate('/')
//           }
//           else{
//             toast.info("You Don't have Access", {
//               position: "top-center",
//               limit: 1,
//               transition: Zoom,
//               autoClose: 2000,
//               hideProgressBar: false,
//               closeOnClick: false,
//               pauseOnHover: true,
//               draggable: true,
//               progress: undefined,
//               theme: "dark"
//             })
//           }
//         }
//       }
//       catch(error){
      
    
//         console.log(error)
//   }}


    let Login = async(e) => {
        e.preventDefault()
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            toast.success("Login Successfull", {
              position: "top-center",
              limit: 1,
              transition: Zoom,
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark"
            })
            Navigate('/')
            sessionStorage.setItem("Patient-details",
            JSON.stringify({
              Email:email,
              Doctor_name:Doctor,
              UID:userCredential.user.uid
            }))
          
        })
        .catch((error) => {
            const errorcode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            if(errorMessage.includes('wrong')){
            toast.error("Password incorrect Please check your Password", {
                position: "top-center",
                limit: 1,
                transition: Zoom,
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
              })}
              if(errorMessage.includes('attempts')){
                toast.error("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.", {
                  position: "top-center",
                  limit: 1,
                  transition: Zoom,
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark"
                })
              }
        });
       
     
      }
  return <>
  <div className='Login-page'>
  <div className='page-left-side'>
    <img src='7317079-removebg-preview.png' className='animation' />
    <img src="ayurailogofull.png" className="logo-img" alt="Logo" />
    </div>
    <div className='page-right-side'>
        <div id='Signin'>
            <p>Sign in</p>
            <TextField sx={{ m: 1, width: '30ch' }} id="outlined-basic" label="Email" variant="outlined" onChange={(e)=>setEmail(e.target.value)}/>
            <FormControl sx={{ m: 1, width: '30ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            onChange={(e)=>setPassword(e.target.value)}
          />
          
        </FormControl>
        <TextField sx={{ m: 1, width: '30ch' }} id="outlined-basic" label="Doctor Name" variant="outlined" onChange={(e)=>setDoctor(e.target.value)}/>
        <Button variant="contained" className="Login-btn" onClick={Login}>Login</Button>
        </div>
    </div>
    </div>
  </>
}

export default Login