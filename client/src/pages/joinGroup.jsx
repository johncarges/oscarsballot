import React from 'react'
import { useLoaderData, useNavigate, redirect } from 'react-router-dom'


export default function JoinGroup() {

    const {group, user} = useLoaderData()

    console.log(group)

    const navigate = useNavigate()

    const onJoinGroup = async (e) => {

        // if (myGroups.map(group=>group._id).includes(searchResult._id)){
        //     console.log('Already in group')
        //     return
        // }
        
        const res = await fetch(`https://oscarsballot.onrender.com/api/groups/adduser/${group.id}`,{
            method: 'PATCH',
            headers: {'content-type':'application/json','accepts':'application/json'},
            credentials: 'include'
        })
        if (!res.ok) {
            const data = await res.json()
            console.log(data)
            return null
        }
        
        navigate('/groups')
    }


    return (
        <div>
            <h1>Join This group?</h1>
            <div className='group-search-result'>
                <h3>Group Name</h3>
                <h5>Members</h5>
                <ul>
                    {group.users.map(user=>{
                        return <li>{user.username}</li>
                    })}
                </ul>
                {(group.users.includes(user))
                    ? <button disabled>Already a member!</button>
                    : <button onClick={onJoinGroup}>Join</button>
                }
            </div>

        </div>
    )

}

export async function loader({ params }) {

    const groupId = params.id

    const groupRes = await fetch(`https://oscarsballot.onrender.com/api/groups/${groupId}`)

    if (!groupRes.ok){
        return redirect('/groups') // BUILD THIS OUT
    }
    const group = await groupRes.json()

    const userRes = await fetch('https://oscarsballot.onrender.com/api/users/authchecker', {
        headers: {'content-type':'application/json', 'accepts':'application/json'},
        credentials: 'include'
    })
    
    if (!userRes.ok){
        return redirect(`/auth?to=groups&id=${groupId}`)
    }
    const user = await userRes.json()

    return {group, user}
}