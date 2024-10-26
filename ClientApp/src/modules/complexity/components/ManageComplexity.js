import React, { Component } from "react"
import { NotificationService } from "../../general/services/Notification.service";
import { ComplexityService} from "../services/ComplexityService";


class ManageComplexity extends Component {
    compService = new ComplexityService();
    noti = new NotificationService();
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            complexityToEditId: '',
            complexity: {
                value: '',
                touched: false,
                error:''
            },
            complexityList: [],
        }
    }

    componentDidMount(){
        this.loadComplexity();
    }
    
    render(){
        return(
            <>
            <div className="col-md-11 col-xl-9 mx-auto">
                <div className="accordion accordion-primary" id="accordion">
                    <div className="row p-5">
                        <div className="card card-default">
                            <div className="card-header">
                                <h4 className="card-title m-0">
                                    <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                        Add Complexity
                                    </a>
                                </h4>
                            </div>
                            <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <label className="col-lg-3 control-label text-lg-end mt-3">Complexity</label>
                                        <div className="col-lg-5 mt-2">
                                            <input name="marks" type="text" className={(this.state.complexity.error !== "" && this.state.complexity.touched ? "border-danger " : "")+"form-control populate"} value={this.state.complexity.value} disabled={this.state.loading} onBlur={(e) => { this.setComplexityTypeTouched(); this.validateComplexityType(e.target.value); }} onChange={(e) => this.validateComplexityType(e.target.value)} />
                                            {this.state.complexity.error !== "" && this.state.complexity.touched &&
                                                <span className="text-danger">{this.state.complexity.error}</span>
                                            }
                                        </div>
                                        <div className="col-lg-4 mt-2">
                                            <button className="btn btn-success me-2" disabled={this.state.loading} onClick={this.addUpdateComplexity}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            }
                                            {this.state.complexityToEditId === '' ? 'Add' : 'Update'}
                                            </button>
                                            {this.state.complexityToEditId !== '' && 
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
                                                    this.getComplexityList()
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



    validateComplexityType = (value) => {   
        let complexity = this.state.complexity;
        complexity.value = value;
        if (value === "") {
            complexity.error = 'Complexity is required.'
            this.setState({ complexity });
        }   
        else {
            complexity.error = '';
            this.setState({ complexity });
        }
    }

    setComplexityTypeTouched = () => {
        let complexity = this.state.complexity;
        complexity.touched = true;
        this.setState({ complexity });
    }

    getComplexity = () => {
        let complexityList = [];
        this.props.complexityList.forEach((complexity, i) => {
            complexity.push(
                <option key={i} value={complexity.id}>{complexity.name}</option>
            );
        });
        return complexityList;
    }

    addUpdateComplexity = async () => {
        if(this.state.complexity.value !== ""){
            try{
                this.setState({ loading: true });
                if(this.state.complexityToEditId === ''){
                    const response = await this.compService.addComplexity(this.state.complexity.value);
                    let complexList = this.state.complexityList;
                    complexList.unshift(response.data);
                    this.setState({ complexList });
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Complexity has been added.');
                }
                else{
                    const response = await this.compService.editComplexity(this.state.complexityToEditId, this.state.complexity.value);
                    let complexityList = this.state.complexityList;
                    let index = this.state.complexityList.findIndex(f => f.id === this.state.complexityToEditId);
                    complexityList[index] = response.data;
                    this.setState({ complexityList })
                    this.noti.sendNotification(this.noti.types.success, 'Success', 'Complexity has been updated.');
                }
                this.clearForm();
            }
            catch(err){
                this.setState({ loading: false });
                this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
            }
        }
    }

    loadComplexity = async() => {
        try{
            const response = await this.compService.loadComplexity();
            let complexityList = this.state.complexityList;
            complexityList = response.data;
            this.setState({ complexityList });
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    getComplexityList = () => {
        let complexityList = [];
        this.state.complexityList.forEach((complexity, i) => {
            complexityList.push(
                <li className="list-group-item" key={i}>
                    <div className="d-flex justify-content-between align-items-center">
                        {complexity.name}
                        <div className="">
                            <i className="fas fa-pencil-alt pointer text-primary fs-6 me-2" onClick={() => this.selectComplexityForEdit(complexity.id, i)} />
                            <i className="far fa-trash-alt pointer text-danger fs-6" onClick={() => this.deleteComplexity(complexity.id, i)}/>
                        </div>
                    </div>
                </li>
            );
        });
        return complexityList;
    }

    selectComplexityForEdit = (id, index) => {
        let complexity = this.state.complexity;
        complexity.value = this.state.complexityList[index].name;
        this.setState({ complexityToEditId: id, complexity }); 
    }

    deleteComplexity = async (id, index) => {
        try{
            await this.compService.deleteComplexity(id);
            let complexityList = this.state.complexityList;
            complexityList.splice(index, 1);
            this.setState({ complexityList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "Complexity has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }

    clearForm = () => {
        let complexity = {
            value: '',
            touched: false,
            error:''
        }
        this.setState({ complexity, loading: false, complexityToEditId: '' });
    }
}
export default ManageComplexity;

