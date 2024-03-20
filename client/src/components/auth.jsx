import { useState } from "react"
import { useNavigate, redirect, useSearchParams } from "react-router-dom"

export default function Auth() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState(null)
    const [signupError, setSignupError] = useState(null)

    const [searchParams, _] = useSearchParams()
    let destination = searchParams.get('to') === 'groups' ? '/groups' : '/'
    const groupId = searchParams.get('id')
    if (groupId) {
        destination = destination + '/' + groupId
    }

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
        setLoginError(null)
        setSignupError(null)
    }


    const onLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        const body = JSON.stringify({'username':formData.loginUsername.replace(' ',''), 'password': formData.loginPassword})

        const res = await fetch(`https://server.oscarsballot.com/api/users/login`, { 
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
            setLoading(false)
            const message = await res.json()
            setLoginError(message.message)
            return null
        }
        const data = await res.json()
        navigate(destination)

    }

    const onSignup = async (e) => {
        e.preventDefault()
        setLoading(true)

        const url = `https://server.oscarsballot.com/api/users/register`
        const body = JSON.stringify({'username':formData.signupUsername.replace(' ',''), 'password': formData.signupPassword})

        const res = await fetch(url, {
            method: "POST",
            body: body,
            headers: {
                "content-type":"application/json",
                "accepts":"application/json"
            },
            credentials: 'include'
        })
        if (!res.ok) {
            setLoading(false)
            const {message} = await res.json()
            setSignupError(message)
            console.log(message)
            return null
        }

        navigate(destination)
        setLoading(false)
    }
    
    const onDemoLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        const body = JSON.stringify({'username':'demo1', 'password': 'demo1'})

        const res = await fetch(`https://server.oscarsballot.com/api/users/login`, { 
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
            setLoading(false)
            const message = await res.json()
            setLoginError(message.message)
            return null
        }
        const data = await res.json()
        navigate(destination)
        
    }

    

    const buttonStyle = loading ? {color:'grey'} : {}
    const formStyle = loading ? {opacity: '40%'} : {}
    const loadingStyle = loading ? {opacity: '70%'} : {}

    return (
        <div className='auth-page-container'>
            <div className='auth-banner'><h2>Oscars Ballot</h2></div>
            <div className='auth-page page' >
                <h2>Login</h2>
                {loginError && <p className='error-message'>{loginError}</p> }
                <form style={formStyle} onChange={onChange} onSubmit={onLogin}>
                    <input name='loginUsername' placeholder="Username" value={formData.loginUsername}/>
                    <input name='loginPassword' placeholder="Password" type='password' value={formData.loginPassword}/>
                    <button type='submit' style={buttonStyle} disabled={loading}>Log In</button>
                </form>
                <button className='demo-login' onClick={onDemoLogin}>Demo Login</button>
                <h2>New User?</h2>
                {signupError && <p className='error-message'>{signupError}</p> }
                <form style={formStyle} name='signup' onChange={onChange} onSubmit={onSignup} >
                    <input name='signupUsername' placeholder="Username" value={formData.signupUsername} />
                    <input name='signupPassword' placeholder="Password" type='text' onFocus={(e)=> e.target.type ='password'} value={formData.signupPassword}/>
                    <button type='submit' style={buttonStyle} disabled={loading}>Sign Up</button>
                </form>
            </div>

        </div>
    )

}