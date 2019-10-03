import React from 'react';
import ReactDOM from 'react-dom';
import AddPlan from './components/AddPlan'
import Days from './components/WeekDays'
import './scss/main.scss';
import * as serviceWorker from './serviceWorker';
import EditPlan from './components/EditPlan';
import uuidV4 from 'uuid/v4'

class MyPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            weekly: [],
            addModalIsOpen: false,
            editModalIsOpen: false,
            newPlanDay: 'monday',
            newPlanNote: '',
            newPlanStartTime: '00:00',
            newPlanEndTime: '00:30',
            currentlyEditing: undefined,
            editPlanDay: 'monday',
            editPlanNote: '',
            editPlanStartTime: '00:00',
            editPlanEndTime: '00:30',
            editPlanId: undefined,
            monday: [], tuesday: [], wednesday: [], thursday: [],
            friday: [], saturday: [], sunday: []
        }
    }
    openModal = (whichModal, ...planInfo) => {
        //startTime, startMinute, endTime, endTimeMinute, note, day, planId <- args list
        if(planInfo.length === 0){
            this.setState({
                [whichModal]: true
            })
        }else if(planInfo){
            //console.log(planInfo)
            if(whichModal === 'editModalIsOpen'){ 
                this.setState({
                    [whichModal]: true,
                    editPlanDay: planInfo[5],
                    editPlanNote: planInfo[4],
                    editPlanStartTime: `${planInfo[0] < 10 ? '0' + planInfo[0] : planInfo[0]}:${planInfo[1] === 0 ? planInfo[1]+'0' : planInfo[1]}`,
                    editPlanEndTime: `${planInfo[2] < 10 ? '0' + planInfo[2] : planInfo[2]}:${planInfo[3] === 0 ? planInfo[3]+'0' : planInfo[3]}`,
                    editPlanId: planInfo[6]
                })
            }else{
                
                this.setState({
                    [whichModal]: true,
                    newPlanDay: planInfo[4],
                    newPlanNote: '',
                    newPlanStartTime: `${planInfo[0]}:${planInfo[1]}`,
                    newPlanEndTime: `${planInfo[2] < 10 ? '0'+planInfo[2] : planInfo[2] }:${planInfo[3]}`
                })
            }        

        }
        
    }
    closeEditModal = () => {
        this.setState({
            editModalIsOpen: false,
            editPlanDay: 'monday',
            editPlanNote: '',
            editPlanStartTime: '00:00',
            editPlanEndTime: '00:30',
            editPlanId: ''
        })
    }
    closeAddModal = () => {
        this.setState({
            addModalIsOpen: false,
            newPlanDay: 'monday',
            newPlanNote: '',
            newPlanStartTime: '00:00',
            newPlanEndTime: '00:30',
        })
    }
    handleEditPlan = () => {

    }
    handleDelete = () => {
        const planId = this.state.planId
        const newPlans = this.state.weekly.filter( plan => plan.planId !== planId)
        this.setState({
            weekly: newPlans,
            editModalIsOpen: false,
            editPlanDay: 'monday',
            editPlanNote: '',
            editPlanStartTime: '00:00',
            editPlanEndTime: '00:30',
            editPlanId: ''
        })
    }
    handleChange = (myNewState, event) => {
        //generic handleChange to avoid repeat same code
        this.setState({
            [myNewState]: event.target.value
        })
    }
    handleEditSubmit = (e) => {
        e.preventDefault()
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const day = this.state.newPlanDay
        const newPlan = {
            day: this.state.newPlanDay,
            start: this.state.newPlanStartTime,
            end: this.state.newPlanEndTime,
            note: this.state.newPlanNote,
            planId: uuidV4()
        }
        const newPlans = this.state.weekly.length === 0 ? [] : this.state.weekly.slice()
        newPlans.push(newPlan)

        this.setState( (state, props) => {
            console.log(state[day])
            const newDayPlan = state[day]
            newDayPlan.push(newPlan)
            return{
                weekly: newPlans,
                addModalIsOpen: false,
                newPlanDay: 'monday',
                newPlanNote: '',
                newPlanStartTime: '00:00',
                newPlanEndTime: '00:30',
                [this.state.newPlanDay]: newDayPlan
            }
        })
    }
    splitPlans = (weekly) => {
        
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
                    default:
                        this.state.monday.push(plan)
                    break;
                }
            })
        }
    }

    renderTime = () => {
        const times = []
        let hour = 0
        let minute = 0
        for(let i = 0; i< 48; i++){
            let hourText;
            let minuteText;

            if(hour < 10){
                hourText = `0${hour}`
            }else{
                hourText =`${hour}`
            }
            minute === 0 ? minuteText = `${minute}0` : minuteText = `${minute}`

            const timeSlot = <option key={i} value={`${hourText}:${minuteText}`}>{`${hourText}:${minuteText}`}</option>
            times.push(timeSlot)

            if(minute === 0){
                minute = 30
            }else{
                minute = 0
                hour ++
            }
        }
        return times
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
            // this.splitPlans(this.state.weekly)
            //set items
            const json = JSON.stringify(this.state.weekly)
            localStorage.setItem('weekly', json)
        }
    }
    render(){
        // console.log(uuidV4())
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
                    openModal={this.openModal}
                />
                <button type='button' value="addModalIsOpen" onClick={ (e) => this.openModal('addModalIsOpen')} >Add</button>
                <AddPlan
                    isOpen={this.state.addModalIsOpen}
                    onRequestClose={this.closeAddModal}
                    genericHandleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    newPlanDay={this.state.newPlanDay}
                    newPlanStartTime={this.state.newPlanStartTime}
                    newPlanEndTime={this.state.newPlanEndTime}
                    renderTime={this.renderTime}
                />
                <EditPlan
                    isOpen={this.state.editModalIsOpen}
                    onRequestClose={this.closeEditModal}
                    genericHandleChange={this.handleChange}
                    renderTime={this.renderTime}
                    handleEditSubmit={this.handleEditSubmit}
                    editPlanDay={this.state.editPlanDay}
                    editPlanStartTime={this.state.editPlanStartTime}
                    editPlanEndTime={this.state.editPlanEndTime}
                    editPlanNote={this.state.editPlanNote}
                    handleDelete={this.handleDelete}
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
