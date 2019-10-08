import React from 'react'
import ReactModal from 'react-modal'
ReactModal.setAppElement('#root')

export default class EditPlan extends React.Component {
    render(){
        return (
            <ReactModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
            >
                <div className="modal">
                    <h2>Edit your plan</h2>
                    <form onSubmit={(e) => {this.props.handleEditSubmit(e)}}>
                        <label>
                            Day of week
                            <select value={this.props.editPlanDay} onChange={(e) => {this.props.genericHandleChange('editPlanDay', e)}}>
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
                            <select value={this.props.editPlanStartTime} onChange={(e) => {this.props.genericHandleChange('editPlanStartTime', e)}}>
                                {this.props.renderTime()}
                            </select>
                        </label>
                        <span> &nbsp;-&nbsp;</span>
                        <label>
                            Time of day
                            <select value={this.props.editPlanEndTime} onChange={(e) => {this.props.genericHandleChange('editPlanEndTime', e)}}>
                                {this.props.renderTime()}
                            </select>
                        </label>
                        <label>
                            Edit note
                            <input 
                                type="text"
                                value={this.props.editPlanNote}
                                onChange={(e) => {this.props.genericHandleChange('editPlanNote', e)}}
                                />
                        </label>
                        <input
                            type="submit"
                            value="Save"
                        />
                    </form>
                    <button onClick={this.props.onRequestClose}>Cancel</button>
                    <button onClick={this.props.handleDelete}>Delete</button>
                </div>
            </ReactModal>
        )
    }
}
