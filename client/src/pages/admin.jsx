import React, {useState} from 'react'
import {redirect, useLoaderData} from 'react-router-dom'


export default function Admin(){

    const {awards} = useLoaderData()

    // array of already locked-in awards
    const lockedIn = awards.filter(award => !!award.winner).map( award => award.id )    
    
    // nominee/awards currently selected to be added
    const [selected, setSelected] = useState({}) // object of awards: chosen nominee (or null)
    

    const postSelections = async () => {
        
        const body = {
            winners: selected
        }

        const res = await fetch('https://oscarsballot.onrender.com/api/awards/addwinners',{
            method: 'PATCH',
            headers: {'accepts':'application/json','content-type':'application/json'},
            body: JSON.stringify(body)
        })

        if (!res.ok) {
            console.log(res.json())
            return null
        }

        const data = await res.json()
        console.log(data)

    }

    const onSelect = (award, nominee) => {
        if (!award.winner) {
            setSelected({
                ...selected,
                [award._id]:nominee._id
            })
        }
    }

    const filmFirst = ['Animated Feature Film', 'Documentary Feature Film', 'Documentary Short Film', 'International Feature Film', 'Best Picture','Animated Short Film', 'Live Action Short Film']


    const renderedAwards = awards.map(award=>{
        const awardClassName = award.winner ? 'award-box announced' : 'award-box'


        return (
            <div key={award._id} className={awardClassName} >
                <h3>{award.name}</h3>
                <ul>
                    {award.nominees.map(nominee=>{
                        // const style = selected[award._id] === nominee._id ? 'nominee-box selected' : 'nominee-box '
                        
                        let style;
                        if (award.winner===nominee._id) {
                            style = 'nominee-box winner' 
                        } else if (!award.winner && selected[award._id] === nominee._id){
                            style = 'nominee-box selected'
                        } else {
                            style= 'nominee-box'
                        }

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
                </ul>

            </div>
        )
    })

    const onSubmit = (e) => {
        e.preventDefault()

        postSelections()

    }

    const ballotSubmitBar = (
        <div className='ballot-submit-bar-container'>
            <div className='ballot-submit-bar'>
                <button onClick={onSubmit}>Post</button>
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

    const awardsRes = await fetch('https://oscarsballot.onrender.com/api/awards',{
        headers: {'accepts':'application/json','content-type':'application/json'}
    })
    if (!awardsRes.ok){
        const data = await(awardsRes.json())
        console.log(data)
        return null
    }

    const awards= await awardsRes.json()
    return {awards}


    
}