import React from 'react';
import ReactModal from 'react-modal'
ReactModal.setAppElement('#root')

export default class AddPlanModal extends React.Component {

    render(){
        return(
            <ReactModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
            >
                <div className="modal">
                    <h2>Add your plan</h2>
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
                                {this.props.renderTime()}
                            </select>
                        </label>
                        <span> &nbsp;-&nbsp;</span>
                        <label>
                            Time of day
                            <select value={this.props.newPlanEndTime} onChange={(e) => {this.props.genericHandleChange('newPlanEndTime', e)}}>
                                {this.props.renderTime()}
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