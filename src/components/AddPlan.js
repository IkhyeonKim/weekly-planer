import React from 'react';
import ReactModal from 'react-modal'
ReactModal.setAppElement('#root')

export default class AddPlanModal extends React.Component {

    render(){
        return(
            <ReactModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                style={this.props.modalStyle}
            >
                <div className="modal">
                    <h2>Add your plan</h2>
                    <div className="modal__buttons">
                        <svg className="modal__buttons--close" xmlns="http://www.w3.org/2000/svg" onClick={this.props.onRequestClose} width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>
                    </div>
                    <form className="modal__form" onSubmit={(e) => {this.props.handleSubmit(e)}}>

                        <div>
                            <label>
                                <span>Day of week</span>
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
                        </div>

                        <div>
                            <label>
                                <span>From</span>
                                <select value={this.props.newPlanStartTime} onChange={(e) => {this.props.genericHandleChange('newPlanStartTime', e)}}>
                                    {this.props.renderTime()}
                                </select>
                            </label>
                            <span> &nbsp;-&nbsp;</span>
                            <label>
                                <span>To</span>
                                <select value={this.props.newPlanEndTime} onChange={(e) => {this.props.genericHandleChange('newPlanEndTime', e)}}>
                                    {this.props.renderTime()}
                                </select>
                            </label>
                        </div>
                        <div>                               
                            <input 
                                placeholder="Add note"
                                className="modal__form--input"
                                type="text"
                                onChange={(e) => {this.props.genericHandleChange('newPlanNote', e)}}
                                />
                            <span className="separator"> </span>
 
                        </div>

                        <input
                            className="modal__submit"
                            type="submit"
                            value="Save"
                        />
                    </form>
                </div>
            </ReactModal>
        )
    }
}