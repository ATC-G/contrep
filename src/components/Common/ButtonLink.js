import { Link } from "react-router-dom";

export default function ButtonLink({to, label}){

    return (
        <div className="mb-1 text-end">
            <Link to={to} className="btn btn-primary waves-effect waves-light">{label}</Link> 
        </div>
    )
}