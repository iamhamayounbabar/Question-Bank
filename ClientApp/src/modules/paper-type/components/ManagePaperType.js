import React, { Component } from "react"
import { NotificationService } from "../../general/services/Notification.service";
import { PaperTypeService } from "./services/PaperTypeService";


class ManagePaperType extends Component {
    pService = new PaperTypeService();
    noti = new NotificationService();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            paperTypeToEditId: '',
            paperType: {
                value: '',
                touched: false,
                error: ''
            },
            paperTypeList: [],
        }
    }

    componentDidMount() {
        this.loadPaperTypes();
    }

    render() {
        return (
            <>
                <div className="col-md-11 col-xl-9 mx-auto">
                    <div className="accordion accordion-primary" id="accordion">
                        <div className="row p-5">
                            <div className="card card-default">
                                <div className="card-header">
                                    <h4 className="card-title m-0">
                                        <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                            Add Paper Type
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                    <div className="card-body">
                                        <div className="form-group row">
                                            <label className="col-lg-3 control-label text-lg-end mt-3">Paper Type</label>
                                            <div className="col-lg-5 mt-2">
                                                <input name="marks" type="text" className={(this.state.paperType.error !== "" && this.state.paperType.touched ? "border-danger " : "")+"form-control populate"} value={this.state.paperType.value} disabled={this.state.loading} onBlur={(e) => { this.setPaperTypeTouched(); this.validatePaperType(e.target.value); }} onChange={(e) => this.validatePaperType(e.target.value)} />
                                                {this.state.paperType.error !== "" && this.state.paperType.touched &&
                                                    <span className="text-danger">{this.state.paperType.error}</span>
                                                }
                                            </div>
                                            <div className="col-lg-4 mt-2">
                                                <button className="btn btn-success me-2 " disabled={this.state.loading} onClick={this.addUpdatePaperType}>
                                                    {this.state.loading &&
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>

                                                    }
                                                    {this.state.paperTypeToEditId === '' ? 'Add' : 'Update'}
                                                </button>
                                                {this.state.paperTypeToEditId !== '' &&
                                                    <button className="btn btn-warning" onClick={this.clearForm}>
                                                        Cancel
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                        <div className="row mt-5 mb-3 position-relative">
                                            <div className="col-lg-8 mx-auto">
                                                <ul className="list-group">
                                                    {
                                                        this.getPaperTypesList()
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
   
    validatePaperType = (value) => {
        let paperType = this.state.paperType;
        paperType.value = value;
        if (value === "") {
            paperType.error = 'Paper Type is required.'
            this.setState({ paperType });
        }
        else {
            paperType.error = '';
            this.setState({ paperType });
        }
    }

    setPaperTypeTouched = () => {
        let paperType = this.state.paperType;
        paperType.touched = true;
        this.setState({ paperType });
    }

    getPaperType = () => {
        let paperTypeList = [];
        this.props.paperTypeList.forEach((paperType, i) => {
            paperType.push(
                <option key={i} value={paperType.id}>{paperType.name}</option>
            );
        });
        return paperTypeList;
    }

    addUpdatePaperType = async () => {
        if (this.state.paperType !== "") {
            try {
                this.setState({ loading: true });
                if (this.state.paperTypeToEditId === '') {
                    const response = await this.pService.addPaperType(this.state.paperType.value);
                    let paperTypeList = this.state.paperTypeList;
                    paperTypeList.unshift(response.data);
                    this.setState({ paperTypeList });
                    this.noti.sendNotification(this.noti.types.success, 'Success', "PaperType has been added.");
                }
                else {
                    const response = await this.pService.editPaperType(this.state.paperTypeToEditId, this.state.paperType.value);
                    let paperTypeList = this.state.paperTypeList;
                    let index = this.state.paperTypeList.findIndex(f => f.id === this.state.paperTypeToEditId);
                    paperTypeList[index] = response.data;
                    this.setState({ paperTypeList })
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Paper Type has been updated.');
                }
                this.clearForm();
            }
            catch (err) {
                this.setState({ loading: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
        }
    }

    loadPaperTypes = async () => {
        try {
            const response = await this.pService.loadPaperTypes();
            let paperTypeList = this.state.paperTypeList;
            paperTypeList = response.data;
            this.setState({ paperTypeList });
        }
        catch (err) {
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    getPaperTypesList = () => {
        let paperTypeList = [];
        this.state.paperTypeList.forEach((paperType, i) => {
            paperTypeList.push(
                <li className="list-group-item" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                        {paperType.name}
                        <div className="">
                            <i className="fas fa-pencil-alt pointer text-primary fs-6 me-2" onClick={() => this.selectPaperTypeForEdit(paperType.id, i)} />
                            <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.deletePaperType(paperType.id, i)}/>
                        </div>
                    </div>
                </li>
            );
        });
        return paperTypeList;
    }

    selectPaperTypeForEdit = (id, index) => {
        let paperType = this.state.paperType;
        paperType.value = this.state.paperTypeList[index].name;
        this.setState({ paperTypeToEditId: id, paperType });
    }

    deletePaperType = async (id, index) => {
        try {
            await this.pService.deletePaperType(id);
            let paperTypeList = this.state.paperTypeList;
            paperTypeList.splice(index, 1);
            this.setState({ paperTypeList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "PaperType has been deleted.");
        }
        catch (err) {
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    clearForm = () => {
        let paperType = {
            value: '',
            touched: false,
            error: ''
        }
        this.setState({ paperType, loading: false, paperTypeToEditId: '' });
    }
}
export default ManagePaperType