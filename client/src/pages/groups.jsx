import React, { useState } from 'react'
import { redirect, useLoaderData } from 'react-router-dom'
import GroupTile from '../components/groupTile'


export default function Groups() {

    const initialData = useLoaderData()
    const [myGroups, setMyGroups] = useState(initialData)

    const [addingGroup, setAddingGroup] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [expanded, setExpanded] = useState(null)

    const [searchTerms, setSearchTerms] = useState({groupName:'',code:''})
    const [searchResult, setSearchResult] = useState(null)
    const [addError, setAddError] = useState(null)
    
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
        
        const res = await fetch('https://oscarsballot.onrender.com/api/groups',{
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
        setAddingGroup(false)

    }



    const newGroupButton = addingGroup
    ? <div>
        <input placeholder='Group name' value={newGroupName} onChange={onChangeNewGroupName}/>
        <button className='new-group-button' onClick={onSubmitNew}>Submit</button>
        <button onClick={()=>setAddingGroup(false)}>Cancel</button>
    </div>
    : <div>
            <button className='new-group-button' onClick={()=>{setAddingGroup(true)}}>Create Group</button>
    </div>


    const onSearchChange = (e) => {
        setSearchTerms(prev=>{return {...prev, [e.target.name]:e.target.value}})
    }

    const onSearchSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`https://oscarsballot.onrender.com/api/groups/findbyname?groupName=${searchTerms.groupName}&code=${searchTerms.code}`)
        if (!res.ok){
            const message = await res.json()
            setAddError(message)
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
        

        const res = await fetch(`https://oscarsballot.onrender.com/api/groups/adduser/${searchResult._id}`,{
            method: 'PATCH',
            headers: {'content-type':'application/json','accepts':'application/json'},
            credentials: 'include'
        })
        if (!res.ok) {
            data = await res.json()
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
    const userRes = await fetch('https://oscarsballot.onrender.com/api/users/authchecker', {
        headers: {'content-type':'application/json', 'accepts':'application/json'},
        credentials: 'include'
    })
    
    if (!userRes.ok){
        console.log(userRes)
        return redirect('/auth?to=groups')
    }
    const userData = await userRes.json()
    
    
    const res = await fetch('https://oscarsballot.onrender.com/api/groups/mygroups',{
        headers: {'accepts':'application/json','content-type':'application/json'},
        credentials: 'include',
    })
    if (!res.ok){
        return redirect("/auth?to=groups")
    }
    return res.json()
}