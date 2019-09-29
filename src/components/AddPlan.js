import React from 'react';
import ReactModal from 'react-modal'
ReactModal.setAppElement('#root')

export default class AddPlanModal extends React.Component {
    // 2. put handleChange
    // 3. put handleSubmit
    // 4. text area? or text input? 
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

    render(){
        return(
            <ReactModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
            >
                <div>
                    <h1>Add your plan</h1>
                    <form onSubmit={(e) => {this.props.handleSubmit(e)}}>
                        <label>
                            Day of week
                            <select value={this.props.newPlanDay} onChange={(e) => {this.props.genericHandleChange('newPlanDay', e)}}>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </label>
                        <label>
                            Time of day
                            <select value={this.props.newPlanStartTime} onChange={(e) => {this.props.genericHandleChange('newPlanStartTime', e)}}>
                                {this.renderTime()}
                            </select>
                        </label>
                        <span> &nbsp;-&nbsp;</span>
                        <label>
                            Time of day
                            <select value={this.props.newPlanEndTime} onChange={(e) => {this.props.genericHandleChange('newPlanEndTime', e)}}>
                                {this.renderTime()}
                            </select>
                        </label>
                        <label>
                            Add note
                            <input 
                                type="text"
                                onChange={(e) => {this.props.genericHandleChange('newPlanNote', e)}}
                                />
                        </label>
                        <input
                            type="submit"
                            value="Save"
                        />
                    </form>
                    <button onClick={this.props.onRequestClose}>Cancel</button>
                </div>
            </ReactModal>
        )
    }
}