import React from 'react'

export default function Day(props){

    const renderSlot = (day) => {
        // console.log(props.dayPlan.length !== 0 ? props.dayPlan[0] : '')
        const slots = []
        let hour = 0
        let minute = 0
        let timeIndex
        let isStillGoing

        if(props.dayPlan.length !== 0){
            timeIndex = 0
            isStillGoing = false
        }
        console.log(props.dayPlan[timeIndex])
        

        slots.push(<div key={day} className="daySlots days">{day}</div>)
        for(let i = 0; i< 48; i++){
            let colored = undefined
            let hourText = hour < 10 ? `0${hour}` : `${hour}`
            let minuteText = minute === 0 ? `0${minute}` : `${minute}`
            let slotKey = `${hourText}:${minuteText}`

            // console.log(`${hourText}:${minuteText}`)
            if(props.dayPlan[timeIndex]){
                // to paint a slot
                if(slotKey === props.dayPlan[timeIndex].start){
                    colored = 'color'
                    isStillGoing = true
                }

            }
            const slot = <div key={slotKey} className={colored || isStillGoing ? `daySlot color`: `daySlot`}></div>
            slots.push(slot)
            
            if(props.dayPlan[timeIndex]){
                if(slotKey === props.dayPlan[timeIndex].end){
                    isStillGoing = false
                    timeIndex++
                }
            }

            if(minute === 0){
                minute = 30
            }else{
                minute = 0
                hour ++
            }
        }
        
        return slots
    }
    return (
        <div className="daySlots">{ renderSlot(props.day) }</div>
    )
}