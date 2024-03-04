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
    }


    const onLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        
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

        const url = `https://oscarsballot.onrender.com/api/users/register`
        const body = JSON.stringify({'username':formData.signupUsername, 'password': formData.signupPassword})

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
            const message = await res.json()
            setSignupError(message)
            console.log(message)
            setLoading(false)
            return null
        }
        const data = await res.json()
        navigate(destination)
    }
    
    // DELETE THIS:
    // const checkButton = async (e) => {

    //     const userRes = await fetch('https://oscarsballot.onrender.com/api/users/authchecker', { 
    //         headers: {'content-type':'application/json', 
    //         'accepts':'application/json', 
    //         'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
    //         'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS'},
    //         credentials: 'include',
            
    //     })
    //     if (!userRes.ok){
    //         const message = await userRes.json()
    //         setError(message.message)
    //     }
    //     const data = await userRes.json()

    // }

    // const logOutButton = async (e) => {
    //     fetch('https://oscarsballot.onrender.com/api/users/logout', {method: "POST", credentials: 'include'})
    // }

    const buttonStyle = loading ? {color:'grey'} : {}
    const formStyle = loading ? {opacity: '70%'} : {}

    return (
        <div className='auth-page-container'>
            <div className='auth-banner'><h2>Oscar Ballot</h2></div>
            <div className='auth-page page'>
                <h2>Login</h2>
                {loginError && <p className='error-message'>{loginError}</p> }
                <form style={formStyle} onChange={onChange} onSubmit={onLogin}>
                    <input name='loginUsername' placeholder="Username" value={formData.loginUsername}/>
                    <input name='loginPassword' placeholder="Password" type='password' value={formData.loginPassword}/>
                    <button type='submit' style={buttonStyle} disabled={loading}>Log In</button>
                </form>
                <h2>New User?</h2>
                {signupError && <p className='error-message'>{signupError}</p> }
                <form name='signup' onChange={onChange} onSubmit={onSignup} >
                    <input name='signupUsername' placeholder="Username" value={formData.signupUsername} />
                    <input name='signupPassword' placeholder="Password" type='text' onFocus={(e)=> e.target.type ='password'} value={formData.signupPassword}/>
                    <button type='submit' style={buttonStyle} disabled={loading}>Sign Up</button>
                </form>
            </div>
            {/* <button onClick={checkButton}>Check</button>
            <button onClick={logOutButton}>Logout</button> */}
        </div>
    )

}