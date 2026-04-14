import AdminLayout from "../../Layout/Adminlayout";
import NewTransaction from "../../Shared/NewTransaction";
import TransactionTable from "../../Shared/TransactionTable"

const AdminTransaction = () =>{

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    return (
        <AdminLayout>
            <NewTransaction/>
            <TransactionTable query = {{branch :userInfo?.branch}}/>
        </AdminLayout>
    )
}
export default AdminTransaction