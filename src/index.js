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
        const newPlan = {
            day: this.state.newPlanDay,
            start: this.state.newPlanStartTime,
            end: this.state.newPlanEndTime,
            note: this.state.newPlanNote
        }
        const newPlans = this.state.weekly.length === 0 ? [] : this.state.weekly.slice()
        newPlans.push(newPlan)

        this.setState({
            weekly: newPlans,
            modalIsOpen: false
        })
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
                />
                <button type='button' onClick={this.openModal} >Add</button>
                <AddPlan
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    genericHandleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
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
