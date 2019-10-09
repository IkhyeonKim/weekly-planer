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
            note: this.state.editPlanNote === '' ? 'No title' : this.state.newPlanNote,
            planId: this.state.editPlanId
        }
        const newWeekly = this.state.weekly
        const index = newWeekly.findIndex( plan => plan.planId === newPlan.planId)
        newWeekly[index] = newPlan
        

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
            note: this.state.newPlanNote === '' ? 'No title' : this.state.newPlanNote,
            planId: uuidV4()
        }
        const newPlans = this.state.weekly.length === 0 ? [] : this.state.weekly.slice()
        newPlans.push(newPlan)

        this.setState( (state, props) => {
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
                // this.splitPlans(weekly)
            }
        } catch (error) {
            console.log(error)
        }
    }

    componentDidUpdate(prevProps, prevState){
        // do something when something has changed?
        if( (prevState.weekly.length !== this.state.weekly.length) || (this.state.editingToggle)){
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
                boxShadow               : '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                borderRadius            : '20px'

              }
        }
        return(
            <div>
                <header>
                    <svg width="29" height="39" viewBox="0 0 29 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="4" y="0" width="25" height="11">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.03235 0.335938H28.8524V10.4768H4.03235V0.335938Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask0)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.09353 0.335938H11.9734H19.8533C22.6168 0.335938 25.0032 1.48048 26.6209 3.31726C28.2386 5.1537 29.0968 7.69009 28.7916 10.4768H20.9087H13.0291C10.2656 10.4768 7.87653 9.33594 6.25886 7.4995C4.64085 5.66273 3.78862 3.126 4.09353 0.335938" fill="#538FFF"/>
                        </g>
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.74304 21.837H9.61993H17.5001C20.2626 21.837 22.8978 20.6999 24.9192 18.8634C26.9408 17.0266 28.352 14.4899 28.6573 11.7002H20.7744H12.8915C10.128 11.7002 7.49351 12.8407 5.47217 14.6778C3.45083 16.5143 2.0453 19.05 1.74304 21.837" fill="#A0C8FF"/>
                        <mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="11" width="13" height="27">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 11.7002H12.8917V37.7419H0V11.7002Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask1)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.8917 11.7002C12.6014 14.352 12.3115 17.0082 12.0215 19.6563C11.7316 22.3048 11.441 24.9569 11.1513 27.6047C10.8461 30.3955 9.43525 32.9325 7.41623 34.7683C5.39522 36.6057 2.75973 37.7419 -0.00012207 37.7419C0.289829 35.0941 0.580112 32.4416 0.86973 29.7935C1.16035 27.1447 1.45296 24.4895 1.74324 21.837C2.04782 19.0507 3.45102 16.5143 5.47237 14.6778C7.49371 12.8407 10.1282 11.7002 12.8917 11.7002" fill="#A0C8FF"/>
                        </g>
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.74304 21.837H6.76099H11.7849C11.9675 20.1502 12.1533 18.4594 12.3382 16.7723C12.5238 15.0855 12.7063 13.3907 12.8915 11.7002C12.8077 11.7002 12.7179 11.7002 12.6342 11.7039C12.5507 11.7039 12.4639 11.7076 12.3801 11.7109C12.2903 11.7187 12.2035 11.7223 12.1198 11.7301C12.0363 11.7374 11.9495 11.7452 11.8627 11.7522C11.7793 11.7599 11.6955 11.771 11.6087 11.7821C11.5246 11.7935 11.4411 11.8049 11.3546 11.816C11.2735 11.8311 11.1867 11.8425 11.1033 11.8572C11.0195 11.8723 10.9357 11.8904 10.8522 11.9059C10.7684 11.9243 10.6876 11.9431 10.6038 11.9616C10.52 11.9804 10.4366 11.9992 10.3554 12.0213C10.2716 12.0404 10.1912 12.0626 10.1104 12.0854C10.0266 12.1075 9.94579 12.1341 9.86499 12.1562C9.78452 12.1827 9.70372 12.2085 9.62325 12.2351C9.54212 12.2609 9.46132 12.2871 9.38052 12.3173C9.30005 12.3471 9.22224 12.3773 9.13845 12.4069C9.06064 12.4364 8.98283 12.4666 8.90536 12.5005C8.82456 12.5303 8.74974 12.5639 8.66894 12.5978C8.59147 12.6313 8.51632 12.6689 8.43851 12.7025C8.3607 12.7397 8.28622 12.7736 8.2114 12.8145C8.1306 12.8525 8.05579 12.8894 7.98097 12.9266C7.90649 12.9679 7.83168 13.0055 7.75387 13.0467C7.67938 13.0877 7.60723 13.1286 7.53275 13.1739C7.46092 13.2148 7.38611 13.2598 7.31429 13.3011C7.24246 13.3457 7.16466 13.3907 7.09882 13.4356C7.02434 13.484 6.95251 13.5293 6.88102 13.5779C6.81219 13.6225 6.74004 13.6712 6.67121 13.7202C6.59972 13.7685 6.53388 13.8175 6.46505 13.8695C6.39289 13.9178 6.32772 13.9705 6.25889 14.0232C6.19006 14.0752 6.12389 14.1275 6.05506 14.1799C5.98956 14.2326 5.92073 14.2846 5.85489 14.3406C5.79204 14.397 5.72621 14.453 5.66369 14.5054C5.59786 14.5614 5.53501 14.6215 5.47217 14.6778C5.40932 14.7335 5.34681 14.7933 5.28663 14.8537C5.22411 14.9094 5.16426 14.9691 5.10142 15.0291C5.03857 15.0889 4.97839 15.1526 4.92186 15.2124C4.86234 15.2721 4.80515 15.3358 4.74264 15.3989C4.68578 15.4593 4.63191 15.5231 4.57206 15.5865C4.5152 15.6536 4.46133 15.7173 4.40181 15.7808C4.3506 15.8482 4.29374 15.912 4.24021 15.9794C4.18668 16.0465 4.13281 16.1103 4.0816 16.1777C4.02773 16.2489 3.97719 16.3156 3.92299 16.3831C3.87544 16.4505 3.82158 16.5213 3.77336 16.5888C3.72282 16.6599 3.67161 16.7307 3.62706 16.8022C3.57618 16.873 3.53129 16.9444 3.48341 17.0152C3.43553 17.0867 3.39097 17.1575 3.34608 17.232C3.30119 17.3031 3.2593 17.3783 3.21441 17.4535C3.16952 17.5276 3.12796 17.5988 3.08606 17.6739C3.04383 17.7484 3.00227 17.8269 2.96037 17.9014C2.92147 17.9769 2.88223 18.0517 2.84366 18.1303C2.80442 18.2047 2.76851 18.2833 2.72994 18.3621C2.69702 18.4369 2.65812 18.5155 2.6222 18.594C2.58929 18.6725 2.55337 18.7514 2.52046 18.8295C2.48787 18.9121 2.45495 18.9906 2.4217 19.0691C2.38911 19.151 2.36218 19.2295 2.33192 19.312C2.30532 19.3906 2.27506 19.4731 2.24846 19.5553C2.21887 19.6375 2.19193 19.7197 2.165 19.8023C2.13773 19.8845 2.1108 19.9667 2.08985 20.0492C2.06624 20.1315 2.0453 20.2137 2.02102 20.2996C2.00007 20.3821 1.97946 20.4677 1.95851 20.5502C1.94055 20.6361 1.91961 20.7187 1.90464 20.8049C1.88369 20.8908 1.8684 20.9767 1.85377 21.0592C1.83581 21.1448 1.82384 21.2307 1.81187 21.3173C1.79691 21.4032 1.78195 21.4891 1.76998 21.575C1.761 21.6649 1.75202 21.7511 1.74304 21.837" fill="#538FFF"/>
                    </svg>
                    <h1>Weekly planner</h1>
                </header>
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
