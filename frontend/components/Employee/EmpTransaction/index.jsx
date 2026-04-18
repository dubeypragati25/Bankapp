import EmployeeLayout from "../../Layout/Employeelayout";
import NewTransaction from "../../Shared/NewTransaction";
import TransactionTable from "../../Shared/TransactionTable";
import { useState } from "react";

const EmpTransaction  = ()=>{
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    const [refresh, setRefresh] = useState(0)
    // return(
    //     <EmployeeLayout>
    //         <NewTransaction/>
    //         <TransactionTable query= {{branch : userInfo?.branch}}/>
    //     </EmployeeLayout>
    // )
    return (
        <EmployeeLayout>
            <NewTransaction setRefresh={setRefresh} />   {/* ✅ pass setter */}
            <TransactionTable 
                query={{ branch: userInfo?.branch }} 
                refresh={refresh} 
            />
        </EmployeeLayout>
    )
}
export default EmpTransaction;