import React from 'react'
import Day from './WeekDay'

export default class Days extends React.Component {
    renderDays = () => {
        // rendering week days monday, tuesday ...
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const daysSlots = []

        days.forEach( day => {
            const slot = <Day day={day}/>
            daysSlots.push(slot)
        })

        return daysSlots
    }
    renderTime = () => {
        const times = []
        let hour = 0
        let minute = 0
        times.push(<div className="dayTime time">Time</div>)
        for(let i = 0; i< 48; i++){
            let hourText;
            let minuteText;
            if(hour < 10){
                hourText = `${hour}`
            }else if(hour > 12){
                hourText = `${hour - 12}`
            }else{
                hourText =`${hour}`
            }
            minute === 0 ? minuteText = `${minute}0` : minuteText = `${minute}`

            const timeSlot = hour < 12 ? <div key={i} className="dayTime"><span>{`${hourText}:${minuteText} AM`}</span></div> :
                                        <div key={i} className="dayTime"><span>{`${hourText}:${minuteText} PM`}</span></div>
            times.push(timeSlot)
            if(minute === 0){
                minute = 30
            }else{
                minute = 0
                hour++
            }
        }
        return times
    }
    render(){
        return(
            <div className="timeTable">
                <div className="dayTimes">{ this.renderTime() }</div>
                { this.renderDays() }
            </div>
        )
    }
}