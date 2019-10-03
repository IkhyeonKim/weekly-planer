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
        let timeIndex = 0
        let isStillGoing
        let dayPlans = []
        let firstPrint = true
        let planId = undefined
        if(props.dayPlan.length !== 0){
            timeIndex = 0
            isStillGoing = false
            dayPlans = sortPlans(props.dayPlan)
        }        

        slots.push(<div key={day} className="daySlots days">{day}</div>)
        for(let i = 0; i< 48; i++){
            
            let hourText = hour < 10 ? `0${hour}` : `${hour}`
            let minuteText = minute === 0 ? `0${minute}` : `${minute}`
            let slotKey = `${hourText}:${minuteText}`
            let printedTime = undefined
            let printedNote = undefined
            let startTime = undefined
            let endTime = undefined
            let startTimeMinute = undefined
            let endTimeMinute = undefined
            let timeIndexInside = timeIndex

            if(dayPlans[timeIndex]){
                // to paint a slot
                startTime = props.extractTime('hour', dayPlans[timeIndex].start)
                endTime = props.extractTime('hour', dayPlans[timeIndex].end)
                startTimeMinute = props.extractTime('minute', dayPlans[timeIndex].start)
                endTimeMinute = props.extractTime('minute', dayPlans[timeIndex].end)
                
                if(slotKey === dayPlans[timeIndex].start){
                    
                    isStillGoing = true
                    firstPrint = true
                    planId = dayPlans[timeIndex].planId
                    let startAmPm = startTime < 12 ? 'AM' : 'PM' 
                    let endAmPm = endTime < 12 ? 'AM' : 'PM' 
                    printedTime = `${startTime > 12 ? startTime - 12: startTime}:
                    ${startTimeMinute === 0 ? `0${startTimeMinute}` : startTimeMinute} ${startAmPm} - 
                    ${endTime > 12 ? endTime - 12: endTime}:
                    ${endTimeMinute === 0 ? `0${endTimeMinute}` : endTimeMinute} ${endAmPm}`
                    printedNote = `${dayPlans[timeIndex].note}`                    
                }
                printedNote = `${dayPlans[timeIndex].note}`
            }
            // console.log(props)
            const slot = <div 
                            key={slotKey} 
                            className={isStillGoing ? `daySlot color`: `daySlot`}
                            onClick={
                                isStillGoing ?
                                () => props.openModal('editModalIsOpen', startTime, startTimeMinute, endTime, endTimeMinute, printedNote, day, dayPlans[timeIndexInside].planId) : 
                                () => props.openModal('addModalIsOpen', hourText, minuteText, props.extractTime('hour', hourText)+1, minuteText, day)
                                }
                            >
                            <p>{isStillGoing ? firstPrint ? printedNote : '' : ''}</p>
                            <p><span>{printedTime ? printedTime : ''}</span></p>
                        </div>
            slots.push(slot)
            firstPrint = false
            if(dayPlans[timeIndex]){
                if(slotKey === dayPlans[timeIndex].end){
                    planId = ''
                    isStillGoing = false
                    firstPrint = true
                    timeIndex++
                }
            }

            if(minute === 0){
                minute = 30
            }else{
                minute = 0
                hour++
            }
        }
        return slots
    }
    return (
        <div className="daySlots">{ renderSlot(props.day) }</div>
    )
}