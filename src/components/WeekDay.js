import React from 'react'

export default function Day(props){

    const renderSlot = (day) => {
        const slots = []
        slots.push(<div className="daySlots days">{day}</div>)
        for(let i = 0; i< 48; i++){
            const slot = <div key={i} className="daySlot">&nbsp;</div>
            slots.push(slot)
        }
        console.log(slots.length)
        return slots
    }
    return (
        <div className="daySlots">{ renderSlot(props.day) }</div>
    )
}