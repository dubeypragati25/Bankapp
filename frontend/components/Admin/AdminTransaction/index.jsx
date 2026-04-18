import AdminLayout from "../../Layout/Adminlayout";
import NewTransaction from "../../Shared/NewTransaction";
import TransactionTable from "../../Shared/TransactionTable"
import { useState } from "react";

const AdminTransaction = () =>{

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    const [refresh, setRefresh] = useState(0)
    return (
        <AdminLayout>
            <NewTransaction setRefresh={setRefresh}/>
            <TransactionTable query = {{branch :userInfo?.branch}} refresh={refresh}/>
        </AdminLayout>
    )
}
export default AdminTransaction