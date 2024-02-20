import React, {useState, useEffect} from 'react'


export default function Ballot(){

    const [ballot, setBallot] = useState([]) // array of all awards and nominees

    const [selected, setSelected] = useState({}) // object of awards: chosen nominee (or null)

    const [missingAwards, setMissingAwards] = useState([]) // array of ids for awards left blank on submission 


    

    useEffect(()=>{

        function initialize(data) {
            setBallot(data)
            setSelected(data.reduce((obj, item)=>{
                return {
                    ...obj,
                    [item._id]:null
                }
            }, {}))
        }

        fetch('http://192.168.1.153:3009/api/awards')
        .then(r=>r.json())
        .then(initialize)
        .catch(console.log)

    },[])

    const postAwards = () => {
        console.log(JSON.stringify(selected))
    }

    const onSelect = (award, nominee) => {
        setSelected({
            ...selected,
            [award._id]:nominee._id
        })
        
        
        if (missingAwards.includes(award._id)) {
            setMissingAwards(missing=> {
                return missing.filter(a=>{
                    return a!==award._id
                })
            })
        } // if user left award unselected, show red outline until selection is made
        
    }

    const filmFirst = ['Animated Feature Film', 'Documentary Feature Film', 'Documentary Short Film', 'International Feature Film', 'Best Picture','Animated Short Film', 'Live Action Short Film']


    const renderedAwards = ballot.map(award=>{
        const awardClassName = missingAwards.includes(award._id) ? 'award-box missing' : 'award-box'

        return (
            <div key={award._id} className={awardClassName} >
                <h3>{award.name}</h3>
                <ul>
                    {award.nominees.map(nominee=>{
                        const style = selected[award._id] === nominee._id ? 'nominee-box selected' : 'nominee-box '
                        
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
        console.log(selected)
        // first check to see if any entries are left blank
        for (const key in selected){
            
            if (selected[key]===null){
                setMissingAwards(prev => [...prev, key])
            }
        }
        if (missingAwards.length === 0) {
            postAwards()
            console.log(missingAwards)
        }

    }

    const ballotSubmitBar = (
        <div className='ballot-submit-bar-container'>
            <div className='ballot-submit-bar'>
                <button onClick={onSubmit}>Submit</button>
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

