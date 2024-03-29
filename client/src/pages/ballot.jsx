import React, {useState} from 'react'
import {redirect, useLoaderData} from 'react-router-dom'


export default function Ballot(){

    const {awards, user, responses} = useLoaderData()
    const [submitted, setSubmitted] = useState(Object.keys(responses).length > 0)

    // Set selected array to previous user responses, or object with null values for each award
    const initialSelected = submitted
        ? responses
        : awards.reduce((a, award)=>({...a,[award._id]:null}),{})
        
    const [selected, setSelected] = useState(initialSelected) // object of awards: chosen nominee (or null)
    const [missingAwards, setMissingAwards] = useState([]) // array of ids for awards left blank on submission 

    const [submitting, setSubmitting] = useState(false)


    const postSelections = async () => {
        setSubmitting(true)
        // Convert from {awardId:nomineeId} to [{award: awardId, nominee:nomineeId}]
        const responses = Object.keys(selected).reduce((a,awardId)=>([
            ...a,
            {
                award: awardId,
                response: selected[awardId]
            }
        ]),[])
        
        const body = {
            responses: responses
        }

        const res = await fetch('https://server.oscarsballot.com/api/ballots',{
            method: 'PATCH',
            headers: {'accepts':'application/json','content-type':'application/json'},
            body: JSON.stringify(body),
            credentials: 'include'
        })

        if (!res.ok) {
            console.log(res.json())
            return null
        }

        const data = await res.json()
        setSubmitted(true)
        setSubmitting(false)
    }

    const onSelect = (award, nominee) => {
        if (!submitted) {
            setSelected({
                ...selected,
                [award._id]:nominee._id
            })
        }
        
        if (missingAwards.includes(award._id)) {
            setMissingAwards(missing=> {
                return missing.filter(a=>{
                    return a!==award._id
                })
            })
        } // if user left award unselected, show red outline until selection is made
        
    }

    const filmFirst = ['Animated Feature Film', 'Documentary Feature Film', 'Documentary Short Film', 'International Feature Film', 'Best Picture','Animated Short Film', 'Live Action Short Film']

    const nomineeStyle = (award, nomineeId) => {
        if (selected[award._id] === nomineeId && !award.winner) {
            return 'nominee-box selected'
        } else if (selected[award._id] === nomineeId && award.winner !== nomineeId) {
            return 'nominee-box incorrect-choice'
        } else if ( award.winner === nomineeId) { 
            return 'nominee-box winner'
        } else {
            return 'nominee-box'
        }
    }    

    const renderedAwards = awards.map(award=>{
        const awardClassName = missingAwards.includes(award._id) ? 'award-box missing' : 'award-box'

        return (
            <div key={award._id} className={awardClassName} >
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

    const onSubmit = (e) => {
        e.preventDefault()
        
        let error = false

        // first check to see if any entries are left blank
        for (const key in selected){
            
            if (selected[key]===null){
                setMissingAwards(prev => [...prev, key])
                error = true
            }
        }
        if (!error) {
            postSelections()
        } else {
            console.log("Not Complete")
        }
    }

    const submitStyle = submitting ? {"opacity":'50%'} : {}

    const ballotSubmitBar = (
        <div className='ballot-submit-bar-container'>
            <div className='ballot-submit-bar'>
                
                { submitted
                    ? <button onClick={null}>Submitted</button>
                    : <button onClick={onSubmit} disable={submitting.toString()} style={submitStyle}>
                        {missingAwards.length > 0 ? 'Please Complete Ballot' : 'Submit'}
                    </button>
                }
            </div>
        </div>
    )
    
    return (
        <div className='ballot-page page'>
            {renderedAwards}
            {ballotSubmitBar}
        </div>
    )
}


export async function loader(){
    const userRes = await fetch('https://server.oscarsballot.com/api/users/authchecker', {
        headers: {'content-type':'application/json', 'accepts':'application/json'},
        credentials: 'include'
    })
    
    if (!userRes.ok){
        const data = await userRes.json()
        console.log(data)
        return redirect('/auth?to=ballot')
    }
    const userData = await userRes.json()

    const awardsRes = await fetch('https://server.oscarsballot.com/api/awards',{
        headers: {'accepts':'application/json','content-type':'application/json'}
    })
    if (!awardsRes.ok){
        console.log(awardsRes.json())
        return null
    }

    const user = {
        id: userData.user.id,
        username: userData.user.username
    }

    const responses = userData.user.responses.reduce((a,response)=>{
        return (
            {
                ...a,
                [response.award]: response.response
            }
        )
    }, {})



    const awards= await awardsRes.json()
    return {awards, user, responses}


    
}