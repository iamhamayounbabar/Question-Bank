import { Component } from "react"
import { Link, NavLink } from "react-router-dom";
import { NotificationService } from "../../../general/services/Notification.service";
import { PaperService } from "../Services/PaperService";

class PaperList extends Component{
    pService = new PaperService();
    noti = new NotificationService()
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            paperList: [],
        }
    }

    componentDidMount(){
        this.loadPapers();
    }

    render(){
        return(
            <>
            <div className="col-md-12 col-xl-12 mx-auto mt-4">
                <div className="accordion accordion-primary" id="accordion">
                    <div className="row">
                        <div className="card card-default">
                            <div className="card-header">
                                <h4 className="card-title m-0">
                                    <a href="toggle" className="accordion-toggle" data-bs-toggle="collapse" data-bs-parent="#accordion" data-bs-target="#collapse">
                                        List Of Questions
                                    </a>
                                </h4>
                            </div>
                            <div id="collapse" className="collapse show" data-bs-parent="#accordion">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col text-end">
                                            <NavLink className="btn btn-primary" to="/dashboard/add-paper">Add Paper</NavLink>
                                        </div>
                                    </div>
                                    <div className="row mt-2 mb-3">
                                        <div className="col-lg-12">
                                            <table className="table table-sm table-bordered">
                                                <thead className="table-info text-center">
                                                    <tr>
                                                        <th>Header</th>
                                                        <th>Name</th>
                                                        <th>Time Allowed</th>
                                                        <th>Paper Type</th>
                                                        <th>Organization</th>
                                                        <th>Year Group</th>
                                                        <th>Footer</th>
                                                        <th>Created By</th>
                                                        <th>Status</th>
                                                        <th style={{ width: '80px' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.getPaperList()
                                                    } 
                                                    {this.state.paperList.length === 0 && !this.state.loading &&
                                                        <tr>
                                                            <td colSpan={10} className="text-center">No records found</td>
                                                        </tr>
                                                    }
                                                    {this.state.loading && 
                                                        <tr>
                                                            <td colSpan={10} className="text-center">Loading...</td>
                                                        </tr>
                                                    }                                            
                                                </tbody>
                                            </table>
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

    seperateWords(words){
        return words.replace(/([a-z])([A-Z])/g, "$1 $2");
    }

    loadPapers = async () => {
        try{
            this.setState({ loading: true });
            const response = await this.pService.getPapers();
            this.setState({ paperList: response.data, loading: false });
        }
        catch(error){
            this.setState({ loading: false });
            this.noti.sendNotification(this.noti.types.error, 'Error', 'Unable to load papers.');
        }
    }

    getPaperList = () => {
        let paperList = [];
        this.state.paperList.forEach((p, i) => {
            paperList.push(
                <tr key={i}>
                    <td>{p.header}</td>
                    <td>{p.name}</td>
                    <td>{p.timeAllowed}</td>
                    <td>{p.paperType.name}</td>
                    <td>{p.organization.name}</td>
                    <td>{p.yearGroup.name}</td>
                    <td>{p.footer}</td>
                    <td>{p.user.name}</td>
                    <td>{p.statusNavigation.name}</td>
                    <td className="text-center align-middle">
                        <Link to={'/dashboard/edit-paper/' + p.id}><i className="fas fa-pencil-alt pointer text-primary fs-5 me-2" /></Link>
                        <i className="far fa-trash-alt pointer text-danger fs-5" onClick={() => this.deletePaper(p.paperId, i)}/>
                    </td>
                </tr>
            );
        });
        return paperList;
    }

    deletePaper = async (id, index) => {
        try{
            await this.pService.deletePaper(id);
            let paperList = this.state.paperList;
            paperList.splice(index, 1);
            this.setState({ paperList });
            this.noti.sendNotification(this.noti.types.success, 'Success', "Paper has been deleted");
        }
        catch(err){
            this.noti.sendNotification(this.noti.types.error, 'Error', err.response.data);
        }
    }
    
}
export default PaperList;


