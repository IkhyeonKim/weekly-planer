import React from 'react'

export default function Day(props){

    const sortPlans = (dayPlans) => {
        const sortedArray = dayPlans.sort( (a, b) => {
            return props.extractTime('hour', a.start) - props.extractTime('hour', b.start) 
        })
        return sortedArray
    }

    const renderSlot = (day) => {
        const slots = []
        let hour = 0
        let minute = 0
        let timeIndex
        let isStillGoing
        let dayPlans = []
        if(props.dayPlan.length !== 0){
            timeIndex = 0
            isStillGoing = false
            dayPlans = sortPlans(props.dayPlan)
        }        

        slots.push(<div key={day} className="daySlots days">{day}</div>)
        for(let i = 0; i< 48; i++){
            let colored = undefined
            let hourText = hour < 10 ? `0${hour}` : `${hour}`
            let minuteText = minute === 0 ? `0${minute}` : `${minute}`
            let slotKey = `${hourText}:${minuteText}`
            let printedTime = undefined
            let printedNote = undefined

            if(dayPlans[timeIndex]){
                // to paint a slot
                const reg = /\d{2}/
                const regMinute = /\d{2}$/

                const startTime = props.extractTime('hour', dayPlans[timeIndex].start)
                const endTime = props.extractTime('hour', dayPlans[timeIndex].end)
                const startTimeMinute = props.extractTime('minute', dayPlans[timeIndex].start)
                const endTimeMinute = props.extractTime('minute', dayPlans[timeIndex].end)
                
                if(slotKey === dayPlans[timeIndex].start){
                    colored = 'color'
                    isStillGoing = true
                    let startAmPm = startTime < 12 ? 'AM' : 'PM' 
                    let endAmPm = endTime < 12 ? 'AM' : 'PM' 
                    printedTime = `${startTime > 12 ? startTime - 12: startTime}:
                    ${startTimeMinute === 0 ? `0${startTimeMinute}` : startTimeMinute} ${startAmPm} - 
                    ${endTime > 12 ? endTime - 12: endTime}:
                    ${endTimeMinute === 0 ? `0${endTimeMinute}` : endTimeMinute} ${endAmPm}`
                    printedNote = `${dayPlans[timeIndex].note}`
                    // printedTime += <p>{dayPlans[timeIndex].note}</p>

                }

            }
            const slot = <div 
                        key={slotKey} 
                        className={colored || isStillGoing ? `daySlot color`: `daySlot`}
                        >
                        <p>{printedTime ? printedTime : ''}</p>
                        <p>{printedNote ? printedNote : ''}</p>
                        </div>
            slots.push(slot)
            
            if(dayPlans[timeIndex]){
                if(slotKey === dayPlans[timeIndex].end){
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