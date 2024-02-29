import React from 'react'



export default function GroupTile(props) {

    const {group, isExpanded, expand} = props

    const users = group.users[0].correct !== undefined ? group.users.toSorted((a,b)=> a.correct - b.correct) : group.users

    if (isExpanded) {
        return (
            <div className='group-tile' >
                <p className='group-name'>
                    <span><i onClick={()=>expand(null)} className="fa-solid fa-angle-down" /></span>
                    {group.name}
                </p>
                <p>Code: {group.code}</p>
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