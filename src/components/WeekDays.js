import React from 'react'
import Day from './WeekDay'

export default class Days extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            monday: [], tuesday: [], wednesday: [], thursday: [],
            friday: [], saturday: [], sunday: []
        }
    }
    splitPlans = () => {
        if(this.props.plans.length !== 0){
            const mondayPlan = []
            const tuesdayPlan = []
            const wednesdayPlan = []
            const thursdayPlan = []
            const fridayPlan = []
            const saturdayPlan = []
            const sundayPlan = []
            
            this.props.plans.forEach( plan => {
                console.log(plan)
                switch (plan.day) {
                    case 'monday':
                        mondayPlan.push(plan)
                        break;        
                    case 'tuesday': 
                        tuesdayPlan.push(plan)
                        break;
                    case 'wednesday': 
                        wednesdayPlan.push(plan)
                        break;
                    case 'thursday': 
                        thursdayPlan.push(plan)
                    break;
                    case 'friday': 
                        fridayPlan.push(plan)
                    break;
                    case 'saturday': 
                        saturdayPlan.push(plan)
                    break;
                    case 'sunday': 
                        sundayPlan.push(plan)
                    break;
                    default:
                        mondayPlan.push(plan)
                    break;
                }
            })
            this.setState({
                monday: mondayPlan, tuesday: tuesdayPlan, wednesday: wednesdayPlan, thursday: thursdayPlan, 
                friday: fridayPlan, saturday: saturdayPlan, sunday: sundayPlan
            })
        }
    }
    componentDidMount(){
        console.log('child')
        this.splitPlans()
    }
    componentDidUpdate(prevProps, prevState){
        if(prevProps.plans.length !== this.props.plans.length){
            this.splitPlans()
        }
    }
    renderDays = () => {
        // rendering week days monday, tuesday ...
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        const daysSlots = []
        const props = this.props
        
        days.forEach( (day, index) => {
            const slot = <Day 
                            key={index} 
                            day={day}
                            dayPlan={this.state[`${day}`]}
                            extractTime={props.extractTime}
                            openModal={props.openModal}
                        />
            daysSlots.push(slot)
        })

        return daysSlots
    }
    renderTime = () => {
        const times = []
        let hour = 0
        let minute = 0
        times.push(<div key={`time`} className="dayTime time">Time</div>)
        for(let i = 0; i< 48; i++){
            let hourText;
            let minuteText;

            if(hour < 10){ hourText = `${hour}` }
            else if(hour > 12){ hourText = `${hour - 12}`}
            else{hourText =`${hour}`}
            minute === 0 ? minuteText = `${minute}0` : minuteText = `${minute}`

            const timeSlot = hour < 12 ? <div key={i} className="dayTime"><span>{`${hourText}:${minuteText} AM`}</span></div> :
                                        <div key={i} className="dayTime"><span>{`${hourText}:${minuteText} PM`}</span></div>
            times.push(timeSlot)
            if(minute === 0){  minute = 30 }
            else{
                minute = 0
                hour++
            }
        }
        return times
    }
    render(){
        // this.splitPlans()
        return(
            <div className="timeTable">
                <div className="dayTimes">{ this.renderTime() }</div>
                { this.renderDays() }
            </div>
        )
    }
}