import React from 'react'
import { Link } from 'react-router-dom'



export default function GroupTile(props) {

    const {group, isExpanded, expand, hasSubmitted} = props


    const users = group.users[0].correct !== undefined ? group.users.toSorted((a,b)=> b.correct - a.correct) : group.users



    if (isExpanded) {
        return (
            <div className='group-tile' >
                <p className='group-name'>
                    <span><i onClick={()=>expand(null)} className="fa-solid fa-angle-down" /></span>
                    {group.name}
                </p>
                <div className='share-box'>
                    <p>Share: </p>
                    <div>
                        <p>Code: {group.code}</p>
                        <button onClick={()=>{navigator.clipboard.writeText(`https://oscarsballot.com/groups/${group._id}`)}}>Copy link to clipboard</button>
                    </div>
                </div>
                {hasSubmitted ? <Link to={`ballot/${group._id}`} style={{color:'black'}}>&rarr; See group picks</Link> : <p>Submit ballot to see group picks</p>}
                <div>
                    <table>
                        <tr>
                            <th>User</th>
                            <th>Correct</th>
                        </tr>
                        {users.map((user)=>{
                            return (<tr>
                                <td>{user.username}</td>
                                <td>{user.correct}</td>
                            </tr>)
                        })}
                    </table>
                </div>
            </div>
        )
    } else {
        return (
            <div className='group-tile' onClick={()=>expand(group._id)}>
                
                <p className='group-name'>
                <span><i className="fa-solid fa-angle-right" /></span>
                    {group.name}
                </p>
            </div>
        )
    }
}