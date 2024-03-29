import React, { useState } from 'react'
import { redirect, useLoaderData } from 'react-router-dom'
import GroupTile from '../components/groupTile'


export default function Groups() {

    const {groupData, user} = useLoaderData()
    const [myGroups, setMyGroups] = useState(groupData)
    const [expanded, setExpanded] = useState(null)

    const [newGroupName, setNewGroupName] = useState('')
    const [addError, setAddError] = useState(null)

    const [searchTerms, setSearchTerms] = useState({groupName:'',code:''})
    const [searchResult, setSearchResult] = useState(null)
    const [searchError, setSearchError] = useState(null)
    
    const hasSubmitted = user.responses.length > 0

    console.log(hasSubmitted)

    const expandGroup = (groupId) => {
        setExpanded(groupId)
    }

    const renderedGroups = myGroups.map(group=>{

        return (
            <li key={group._id}>
                <GroupTile 
                    group={group} 
                    isExpanded={expanded===group._id}
                    expand={expandGroup}
                    hasSubmitted={hasSubmitted}
                />
            </li>
        )
    })


    const onChangeNewGroupName = (e) => {
        setAddError(null)
        setNewGroupName(e.target.value)
    }

    const onSubmitNew = async (e) => {
        if (newGroupName===''){
            setAddError('Name must be included') // TEMP - SET ERROR
            return null
        }
        
        const res = await fetch('https://server.oscarsballot.com/api/groups',{
            method: 'POST',
            headers: {'accepts':'application/json',
            'content-type':'application/json'},
            body: JSON.stringify({groupName: newGroupName}),
            credentials: 'include'
        })
        if (!res.ok){
            const data = await res.json()
            setAddError(data.message)
            return null
        }
        const newGroup = await res.json()
        setMyGroups([
            newGroup,
            ...myGroups
        ])


    }



    const onSearchChange = (e) => {
        setSearchTerms(prev=>{return {...prev, [e.target.name]:e.target.value}})
        setSearchError(null)
    }

    const onSearchSubmit = async (e) => {
        e.preventDefault()
        if (!searchTerms.groupName || !searchTerms.code){
            setSearchError('Name and code must be included.')
            return null
        }
        const res = await fetch(`https://server.oscarsballot.com/api/groups/findbyname?groupName=${searchTerms.groupName}&code=${searchTerms.code}`)
        if (!res.ok){
            const data = await res.json()
            setSearchError(data.message)
            return null
        }
        const data = await res.json()
        console.log(data)
        setSearchResult(data)
    }

    const onJoinGroup = async (e) => {

        if (myGroups.map(group=>group._id).includes(searchResult._id)){
            console.log('Already in group')
            return
        }
        

        const res = await fetch(`https://server.oscarsballot.com/api/groups/adduser/${searchResult._id}`,{
            method: 'PATCH',
            headers: {'content-type':'application/json','accepts':'application/json'},
            credentials: 'include'
        })
        if (!res.ok) {
            const data = await res.json()
            console.log(data)
            return null
        }
        const data = await res.json()
        console.log(data)
        setMyGroups(prev => {
            return [...prev, data]
        })
        setSearchResult(null)
    }

    const renderedSearchResult = searchResult 
    && <div className='group-search-result'>
        <h3>{searchResult.name}</h3>
        <h5>Members</h5>
        <ul>
            {searchResult.users.map(user=>{
                return <li>{user.username}</li>
            })}
        </ul>
        {(myGroups.map(group=>group._id).includes(searchResult._id))
            ? <button disabled>Already a member!</button>
            : <button onClick={onJoinGroup}>Join</button>
        }
    </div>

    return (
        <div className='groups-page page'>
            
            {myGroups.length > 0 
                && 
                <div>
                    <h3>My Groups</h3>
                    <ul className='group-list'>
                        {renderedGroups}
                    </ul>
                </div>
            }
            <div className='new-group-container'>
                <h3>Create Group</h3>
                <div className='error-message'>{addError}</div>
                <div>
                    <input placeholder='Group name' value={newGroupName} onChange={onChangeNewGroupName}/>
                    <button className='new-group-button' onClick={onSubmitNew}>Submit</button>
                </div>
                
            </div>
            <div className='join-group'>
                <h3>Join Group</h3>
                <div className='error-message'>{searchError}</div>
                <form onChange={onSearchChange} className='group-search' onSubmit={onSearchSubmit}>
                    <input name='groupName' placeholder='Group Name' value={searchTerms.groupName}/>
                    <input name='code' placeholder='Code' value={searchTerms.code}/>
                    <button>Search</button>
                </form>
                {renderedSearchResult}
            </div>
        </div>
    )

}

export const loader = async () => {
    const userRes = await fetch('https://server.oscarsballot.com/api/users/authchecker', {
        headers: {'content-type':'application/json', 'accepts':'application/json'},
        credentials: 'include'
    })
    
    if (!userRes.ok){
        const data = await userRes.json()
        console.log(data)
        return redirect('/auth?to=groups')
    }
    const userData = await userRes.json()
    const user = userData.user
    
    const res = await fetch('https://server.oscarsballot.com/api/groups/mygroups',{
        headers: {'accepts':'application/json','content-type':'application/json'},
        credentials: 'include',
    })
    if (!res.ok){
        return redirect("/auth?to=groups")
    }
    // return res.json()
    const groupData = await res.json()
    return {user, groupData}
}