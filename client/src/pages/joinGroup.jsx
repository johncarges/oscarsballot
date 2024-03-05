import React from 'react'
import { useLoaderData, useNavigate, redirect } from 'react-router-dom'


export default function JoinGroup() {

    const {group, user} = useLoaderData()

    console.log(group)
    console.log(user)

    const navigate = useNavigate()

    const onJoinGroup = async (e) => {

        // if (myGroups.map(group=>group._id).includes(searchResult._id)){
        //     console.log('Already in group')
        //     return
        // }
        
        const res = await fetch(`https://server.oscarsballot.com/api/groups/adduser/${group._id}`,{
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

    const alreadyJoined = group.users.map(user=>user._id).includes(user._id)


    return (
        <div className='join-groups-page'>
            <h1>{alreadyJoined ? 'Already a member!' : 'Join this group?'}</h1>
            <div className='group-search-result'>
                <h3>{group.name}</h3>
                <h5>Members</h5>
                <ul>
                    {group.users.map(user=>{
                        return <li>{user.username}</li>
                    })}
                </ul>
                {alreadyJoined
                    ? <button disabled>Already a member!</button>
                    : <button onClick={onJoinGroup}>Join</button>
                }
            </div>

        </div>
    )

}

export async function loader({ params }) {

    const groupId = params.id

    const groupRes = await fetch(`https://server.oscarsballot.com/api/groups/${groupId}`)

    if (!groupRes.ok){
        return redirect('/groups') // BUILD THIS OUT
    }
    const group = await groupRes.json()

    const userRes = await fetch('https://server.oscarsballot.com/api/users/authchecker', {
        headers: {'content-type':'application/json', 'accepts':'application/json'},
        credentials: 'include'
    })
    
    if (!userRes.ok){
        return redirect(`/auth?to=groups&id=${groupId}`)
    }
    const userData = await userRes.json()
    const user = userData.user

    return {group, user}
}