import React from 'react'
import {useLoaderData} from 'react-router-dom'


export default function GroupBallot(){

    const {awards} = useLoaderData()
        
    console.log(awards)

    const filmFirst = ['Animated Feature Film', 'Documentary Feature Film', 'Documentary Short Film', 'International Feature Film', 'Best Picture','Animated Short Film', 'Live Action Short Film']

    const nomineeStyle = (award, nomineeId) => {
        if ( award.winner === nomineeId) { 
            return 'nominee-box winner'
        } else {
            return 'nominee-box'
        }
    }    

    const renderedAwards = awards.map(award=>{
        
        return (
            <div key={award._id} className='award-box' >
                <h3>{award.name}</h3>
                <div className='nominees'>
                    {award.nominees.map(nominee=>{
                        // const style = selected[award._id] === nominee._id ? 'nominee-box selected' : 'nominee-box '
                        const style = nomineeStyle(award, nominee._id)
                        
                        if (filmFirst.includes(award.name)) {
                            return (
                            <div key={nominee._id} className={style}  onClick={()=>onSelect(award, nominee)}>
                                <h4 className='film-name'>{nominee.film}</h4>
                                <h5 className='nominee'>{nominee.name}</h5>
                            </div>
                            )
                        } else {
                            return (
                                <div key={nominee._id} className={style}  onClick={()=>onSelect(award, nominee)}>
                                    <h4 className='nominee'>{nominee.name}</h4>
                                    <h5 className='film-name'>{nominee.film}</h5>
                                </div>
                            )
                        }
                    
                    })}
                </div>

            </div>
        )
    })

    return (
        <div className='ballot-page page'>
            {renderedAwards}
        </div>
    )
}


export async function loader({params}){
    
    const {groupId} = params

    const awardsRes = await fetch('https://server.oscarsballot.com/api/awards',{
        headers: {'accepts':'application/json','content-type':'application/json'}
    })
    if (!awardsRes.ok){
        console.log(awardsRes.json())
        return null
    }

    const awards= await awardsRes.json()
    
    const groupRes = await fetch(`https://server.oscarsballot.com/api/groups/${groupId}`)

    if (!groupRes.ok){
        const data = await groupRes.json()
        console.log(data)
        return null
    }
    const group = await groupRes.json()

    awards.forEach(award=> {
        award.nominees.forEach(nominee=>{
            nominee.users = []
            
        })
    })

    group.users.forEach(user => {
        user.responses.forEach(response => {
            const award = awards.filter(award=> award._id===response.award)[0]
            const nominee = award.nominees.filter(nom=> nom._id===response.response)[0]
            nominee.users.push(user)
        })
    })


    return {awards}


    
}