import { useState } from "react"
import { useNavigate, redirect, useSearchParams } from "react-router-dom"

export default function Auth() {

    const navigate = useNavigate()

    const [searchParams, _] = useSearchParams()
    const destination = searchParams.get('to') === 'groups' ? '/groups' : '/'

    const initialState = {
        loginUsername: '',
        loginPassword: '',
        signupUsername: '',
        signupPassword: ''
    }

    const [formData, setFormData] = useState(initialState)

    const onChange = (e) => {
        setFormData((prev)=>{
            return {...prev, [e.target.name]:e.target.value}
        })
    }


    const onLogin = async (e) => {
        e.preventDefault()
        const body = JSON.stringify({'username':formData.loginUsername, 'password': formData.loginPassword})

        const res = await fetch(`https://oscarsballot.onrender.com/api/users/login`, { 
            method: "POST",
            body: body,
            headers: {
                "content-type":"application/json",
                "accepts":"application/json",
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
                'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS' 
            },
            credentials: 'include'
        })
        if (!res.ok) {
            console.log(res.message)
        }
        const data = await res.json()
        navigate(destination)

    }

    const onSignup = (e) => {
        e.preventDefault()
        const url = `https://oscarsballot.onrender.com/api/users/register`
        const body = JSON.stringify({'username':formData.signupUsername, 'password': formData.signupPassword})

        fetch(url, {
            method: "POST",
            body: body,
            headers: {
                "content-type":"application/json",
                "accepts":"application/json"
            }
        })
        .then(r=>r.json())
        .then(console.log)
        .catch(console.log)
    }
    
    // DELETE THIS:
    const checkButton = async (e) => {

        const userRes = await fetch('https://oscarsballot.onrender.com/api/users/authchecker', { 
            headers: {'content-type':'application/json', 
            'accepts':'application/json', 
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'},
            credentials: 'include',
            
        })
        if (!userRes.ok){
            return redirect('/auth?to=ballot')
        }
        const data = await userRes.json()
        console.log(data)
        
        console.log(data)
    }

    const logOutButton = async (e) => {
        fetch('https://oscarsballot.onrender.com/api/users/logout', {method: "POST"})
    }

    return (
        <div className='auth-page-container'>
            <div className='auth-banner'></div>
            <div className='auth-page page'>
                <h2>Login</h2>
                <form onChange={onChange} onSubmit={onLogin}>
                    <input name='loginUsername' placeholder="username" value={formData.loginUsername}/>
                    <input name='loginPassword' placeholder="password" value={formData.loginPassword}/>
                    <button type='submit'>Log In</button>
                </form>
                <h2>Signup</h2>
                <form name='signup' onChange={onChange} onSubmit={onSignup}> 
                    <input name='signupUsername' placeholder="username" value={formData.signupUsername}/>
                    <input name='signupPassword' placeholder="password" value={formData.signupPassword}/>
                    <button type='submit'>Sign Up</button>
                </form>
            </div>
            <button onClick={checkButton}>Check</button>
            <button onClick={logOutButton}>Logout</button>
        </div>
    )

}