import EmployeeLayout from "../../Layout/Employeelayout";
import NewTransaction from "../../Shared/NewTransaction";
import TransactionTable from "../../Shared/TransactionTable";

const EmpTransaction  = ()=>{
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    return(
        <EmployeeLayout>
            <NewTransaction/>
            <TransactionTable query= {{branch : userInfo?.branch}}/>
        </EmployeeLayout>
    )
}
export default EmpTransaction;