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
            editingToggle: false // to fire rendering to child components
        }
    }
    openModal = (whichModal, ...planInfo) => {
        //startTime, startMinute, endTime, endTimeMinute, note, day, planId <- args list
        if(planInfo.length === 0){
            this.setState({
                [whichModal]: true
            })
        }else if(planInfo){
            console.log(planInfo)
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
    handleEditSubmit = (e) => {
        e.preventDefault()
        const newPlan = {
            day: this.state.editPlanDay,
            start: this.state.editPlanStartTime,
            end: this.state.editPlanEndTime,
            note: this.state.editPlanNote,
            planId: this.state.editPlanId
        }
        const newWeekly = this.state.weekly
        console.log(newWeekly)
        const index = newWeekly.findIndex( plan => plan.planId === newPlan.planId)
        newWeekly[index] = newPlan
        console.log(newWeekly)

        const json = JSON.stringify(newWeekly)
        localStorage.setItem('weekly', json)

        this.setState({
            weekly: newWeekly,
            editModalIsOpen: false,
            editPlanDay: 'monday',
            editPlanNote: '',
            editPlanStartTime: '00:00',
            editPlanEndTime: '00:30',
            editPlanId: '',
            editingToggle: true
        })
    }
    handleDelete = () => {
        const planId = this.state.editPlanId
        const newPlans = this.state.weekly.filter( plan => plan.planId !== planId)
        console.log(planId, newPlans)
        // this.splitPlans(newPlans)
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
        const value = event.target.value
        if(myNewState === 'newPlanEndTime'){
            if(this.extractTime('hour', this.state.newPlanStartTime) > this.extractTime('hour', value) ){
                const minute = this.extractTime('minute', value)
                const hour = this.extractTime('hour', value) - 1
                this.setState({
                    newPlanStartTime: `${hour < 10 ? '0' + hour: hour }:${minute === 0 ? minute + '0' : 30}`,
                    newPlanEndTime: value
                })
            }else{
                this.setState({newPlanEndTime: value})
            }
        }else if(myNewState === 'newPlanStartTime'){
            if(this.extractTime('hour', this.state.newPlanEndTime) < this.extractTime('hour', value) ){
                const minute = this.extractTime('minute', value)
                const hour = this.extractTime('hour', value) + 1
                this.setState({
                    newPlanEndTime: `${hour < 10 ? '0' + hour: hour }:${minute === 0 ? minute + '0' : 30}`,
                    newPlanStartTime: value
                })
            }else{
                this.setState({newPlanStartTime: value})
            }
        }else{
            this.setState({
                [myNewState]: value
            })
        }
        
        
        
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
            const newDayPlan = state[day] ? state[day] : []
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
                console.log('parent has mounted')
                // this.splitPlans(weekly)
            }
        } catch (error) {
            console.log(error)
        }
    }

    componentDidUpdate(prevProps, prevState){
        // do something when something has changed?
        if( prevState.weekly.length !== this.state.weekly.length || this.state.editingToggle){
            // this.splitPlans(this.state.weekly)
            //set items
            const json = JSON.stringify(this.state.weekly)
            localStorage.setItem('weekly', json)

            this.setState({
                editingToggle: false
            })
        }
    }
    render(){
        // console.log(uuidV4())
        const customModalStyle = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)',
                width                 : '70vw',
                maxWidth              : '900px',
                background              : '#A1E0F4',
                boxShadow               : '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)'

              }
        }
        return(
            <div>
                <Days
                    plans={this.state.weekly}
                    extractTime={this.extractTime}
                    openModal={this.openModal}
                    editingToggle={this.state.editingToggle}
                />
                {/* <svg onClick={ () => this.openModal('addModalIsOpen')} className="addButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg> */}
                <svg onClick={ () => this.openModal('addModalIsOpen')} className="add-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
            
                <AddPlan
                    isOpen={this.state.addModalIsOpen}
                    onRequestClose={this.closeAddModal}
                    genericHandleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    newPlanDay={this.state.newPlanDay}
                    newPlanStartTime={this.state.newPlanStartTime}
                    newPlanEndTime={this.state.newPlanEndTime}
                    renderTime={this.renderTime}
                    modalStyle={customModalStyle}
                />
                <EditPlan
                    isOpen={this.state.editModalIsOpen}
                    onRequestClose={this.closeEditModal}
                    genericHandleChange={this.handleChange}
                    renderTime={this.renderTime}
                    editPlanDay={this.state.editPlanDay}
                    editPlanStartTime={this.state.editPlanStartTime}
                    editPlanEndTime={this.state.editPlanEndTime}
                    editPlanNote={this.state.editPlanNote}
                    editPlanId={this.state.editPlanId}
                    handleDelete={this.handleDelete}
                    handleEditSubmit={this.handleEditSubmit}
                    modalStyle={customModalStyle}
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
