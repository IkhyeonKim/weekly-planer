import React from 'react';
import ReactDOM from 'react-dom';
import AddPlan from './components/AddPlan'
import Days from './components/WeekDays'
import './scss/main.scss';
import * as serviceWorker from './serviceWorker';


class MyPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            weekly: [],
            modalIsOpen: false,
            newPlanDay: 'monday',
            newPlanNote: '',
            newPlanStartTime: '00:00',
            newPlanEndTime: '00:30',
            slotKey: undefined,
            monday: [], tuesday: [], wednesday: [], thursday: [],
            friday: [], saturday: [], sunday: []
        }
    }
    openModal = () => {
        this.setState({
            modalIsOpen: true
        })
    }
    closeModal = () => {
        this.setState({
            modalIsOpen: false
        })
    }
    handleChange = (myNewState, event) => {
        //generic handleChange to avoid repeat same code
        this.setState({
            [myNewState]: event.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const day = this.state.newPlanDay
        const newPlan = {
            day: this.state.newPlanDay,
            start: this.state.newPlanStartTime,
            end: this.state.newPlanEndTime,
            note: this.state.newPlanNote,
            slotKey: this.state.slotKey
        }
        const newPlans = this.state.weekly.length === 0 ? [] : this.state.weekly.slice()
        newPlans.push(newPlan)

        this.setState( (state, props) => {
            console.log(state[day])
            const newDayPlan = state[day]
            newDayPlan.push(newPlan)
            return{
                weekly: newPlans,
                modalIsOpen: false,
                newPlanDay: 'monday',
                newPlanNote: '',
                newPlanStartTime: '00:00',
                newPlanEndTime: '00:30',
                [this.state.newPlanDay]: newDayPlan
            }
        })
    }
    splitPlans = (weekly) => {
        console.log(weekly.length)
        if(weekly.length !== 0){
            weekly.forEach( plan => {
                switch (plan.day) {
                    case 'monday':
                        this.state.monday.push(plan)
                        break;        
                    case 'tuesday': 
                        this.state.tuesday.push(plan)
                        break;
                    case 'wednesday': 
                        this.state.wednesday.push(plan)
                        break;
                    case 'thursday': 
                        this.state.thursday.push(plan)
                    break;
                    case 'friday': 
                        this.state.friday.push(plan)
                    break;
                    case 'saturday': 
                        this.state.saturday.push(plan)
                    break;
                    case 'sunday': 
                        this.state.sunday.push(plan)
                    break;
                }
            })
        }
    }

    extractTime = (type, timeString) => {
        const regHour = /\d{2}/
        const regMinute = /\d{2}$/
        if(type === 'hour'){
            return parseInt(regHour.exec(timeString)[0])
        }else if(type === 'minute'){
            return parseInt(regMinute.exec(timeString)[0])
        }
    }
    componentDidMount(){
        try {
            // Get the plans when component has mounted
            const json = localStorage.getItem('weekly')
            const weekly = JSON.parse(json)

            if(weekly){
                this.setState({
                    weekly  
                })
                this.splitPlans(weekly)
            }
        } catch (error) {
            console.log(error)
        }
    }

    componentDidUpdate(prevProps, prevState){
        // do something when something has changed?
        if(prevState.weekly.length !== this.state.weekly.length){
            //set items
            const json = JSON.stringify(this.state.weekly)
            localStorage.setItem('weekly', json)
        }
    }
    render(){
        return(
            <div>
                <Days
                    plans={this.state.weekly}
                    mondayPlan={this.state.monday}
                    tuesdayPlan={this.state.tuesday}
                    wednesdayPlan={this.state.wednesday}
                    thursdayPlan={this.state.thursday}
                    fridayPlan={this.state.friday}
                    saturdayPlan={this.state.saturday}
                    sundayPlan={this.state.sunday}
                    extractTime={this.extractTime}
                />
                <button type='button' onClick={this.openModal} >Add</button>
                <AddPlan
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    genericHandleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    newPlanDay={this.state.newPlanDay}
                    newPlanStartTime={this.state.newPlanStartTime}
                    newPlanEndTime={this.state.newPlanEndTime}
                />
            </div>
            
        )
    }
}


ReactDOM.render(<MyPage />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
