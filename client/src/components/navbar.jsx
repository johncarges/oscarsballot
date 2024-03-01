import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {


    const navigate = useNavigate()

    const className = ({isActive})=> {
        return isActive ? "active navlink" : "inactive navlink"
    }

    const onLogout = async (e) => {
        const res = await fetch('https://oscarsballot.onrender.com/api/users/logout',{method:'POST'})
        if (!res.ok) console.log(res.json())
        navigate('/auth')
    }

    return (
        <div className='navbar-container'>
            <header className='navbar'>
                <NavLink className={className} to='/'>Ballot</NavLink>
                <NavLink className={className} to='/groups'>Groups</NavLink>
                <button onClick={onLogout}>Log Out</button>
            </header>
        </div>
    )

}
