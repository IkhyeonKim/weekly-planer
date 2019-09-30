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

        slots.push(<div key={day} className="daySlots days">{day}</div>)
        for(let i = 0; i< 48; i++){
            let colored = undefined
            let hourText = hour < 10 ? `0${hour}` : `${hour}`
            let minuteText = minute === 0 ? `0${minute}` : `${minute}`
            let slotKey = `${hourText}:${minuteText}`
            let printedText = undefined

            // console.log(`${hourText}:${minuteText}`)
            if(props.dayPlan[timeIndex]){
                // to paint a slot
                const reg = /\d{2}/
                const regMinute = /\d{2}$/

                const startTime = parseInt(reg.exec(props.dayPlan[timeIndex].start)[0])
                const endTime = parseInt(reg.exec(props.dayPlan[timeIndex].end)[0])
                const startTimeMinute = parseInt(regMinute.exec(props.dayPlan[timeIndex].end)[0])
                const endTimeMinute = parseInt(regMinute.exec(props.dayPlan[timeIndex].end)[0])

                if(slotKey === props.dayPlan[timeIndex].start){
                    colored = 'color'
                    isStillGoing = true
                    let startAmPm = startTime < 12 ? 'AM' : 'PM' 
                    let endAmPm = endTime < 12 ? 'AM' : 'PM' 
                    printedText = `${startTime > 12 ? startTime - 12: startTime}:${startTimeMinute} ${startAmPm} - ${endTime > 12 ? endTime - 12: endTime}:${endTimeMinute} ${endAmPm}`
                    printedText += `\n${props.dayPlan[timeIndex].note}`
                }

            }
            const slot = <div key={slotKey} className={colored || isStillGoing ? `daySlot color`: `daySlot`}>{printedText?printedText:''}</div>
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