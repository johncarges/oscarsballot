import React from 'react'
import { useSearchParams } from 'react-router-dom'


export default function joinGroup() {

    const [searchParams, _] = useSearchParams()
    const {groupId} = searchParams

    return (
        <div>
            <h1>Join This group?</h1>
            <div className='group-search-result'>
                <h3>Group Name</h3>
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

        </div>
    )

}

export function loader({ request }) {
    const groupId = new URL(request.url).searchParams.get('id')
}