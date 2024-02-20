import { NavLink } from "react-router-dom";

export default function Navbar() {

    const className = ({isActive})=> {
        return isActive ? "active navlink" : "inactive navlink"
    }

    return (
        <div className='navbar-container'>
            <header className='navbar'>
                <NavLink className={className} to='/'>Ballot</NavLink>
                <NavLink className={className} to='/groups'>Groups</NavLink>
            </header>
        </div>
    )

}
