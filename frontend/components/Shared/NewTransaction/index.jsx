import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Image, Form, Select, Button, message, Empty } from "antd";
import { use, useEffect, useState } from "react"
import { http, trimData } from "../../../modules/modules";
import { mutate } from "swr";

import Cookies from "universal-cookie";
const cookies = new Cookies();


const NewTransaction = ({ setRefresh }) => {

    const token = cookies.get("authToken")

    //get userInfo from session storage
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    const userEmail = userInfo?.email
    const [accountDetail, setAccountDetail] = useState(null);
    const [balanceState, setBalanceState] = useState(0);

    useEffect(() => {
        const httpReq = http(token);
        const fetchAccountDetails = async () => {
            try {
                const res = await httpReq.get(`/api/find-by-email?email=${userEmail}`);
                setAccountDetail(res.data.data);
            } catch (err) {
                console.error("Failed to fetch account details", err);
            }
        }
        fetchAccountDetails();
    },[userEmail])

    //form info
    const [transactionForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    //state collection
    const [accountNo, setAccountNo] = useState(accountDetail?.accountNo || "");
    console.log("accountDetail", accountDetail)



    const onFinish = async (values) => {
        try {
            const finalObj = trimData(values);
            let balance = 0
            if (finalObj.transactionType === "cr") {
                balance = Number(accountDetail.finalBalance) + Number(finalObj.transactionAmount)
                setBalanceState(balance)
            }
            else if (finalObj.transactionType === "dr") {
                balance = Number(accountDetail.finalBalance) - Number(finalObj.transactionAmount)
                setBalanceState(balance)
            }
            finalObj.currentBalance = accountDetail.finalBalance
            finalObj.customerId = accountDetail._id
            finalObj.accountNo = accountDetail.accountNo
            finalObj.branch = accountDetail.branch
            const httpReq = http(token)

            await httpReq.post("/api/transaction", finalObj)
            

            await httpReq.put(`/api/customers/${accountDetail._id}`, {
                finalBalance: balance
            })

            mutate(`/api/transaction?accountId=${accountDetail._id}`)

            messageApi.success("Transaction created successfully !")
            setRefresh(prev => prev + 1)
            transactionForm.resetFields();

            setAccountDetail({
                ...accountDetail,
                finalBalance: balance
            })
        } catch (err) {
            messageApi.error(err.response ? err.response.data.message : "Unabla to process transaction ! ")
        }
    }

    const searchByAccountNo = async () => {
        try {
            const obj = {
                accountNo,
                branch: userInfo?.branch
            }
            const httpReq = http()
            const { data } = await httpReq.post(`/api/find-by-account`, obj)
            if (data?.data) {
                setAccountDetail(data?.data)
            }
            else {
                messageApi.warning("There is no record of this account no ! ")
                setAccountDetail(null)
            }
        } catch (error) {
            messageApi.error("Unable to find account details !")
        }
    }
    return (
        <div>
            {contextHolder}
            <Card
                title="New Transaction"
                extra={
                    <Input
                        onChange={(e) => setAccountNo(e.target.value)}
                        placeholder="Enter account number"
                        suffix={<SearchOutlined
                            onClick={searchByAccountNo}
                            style={{ cursor: "pointer" }} />}
                    />
                }
            >
                {
                       accountDetail ?
                        <div>
                            <div className="flex items-center justify-start gap-2">
                                <Image
                                    src={`${import.meta.env.VITE_BASEURL}/${accountDetail?.profile}`}
                                    width={120}
                                    className="rounded-full"
                                />
                                <Image
                                    src={`${import.meta.env.VITE_BASEURL}/${accountDetail?.signature}`}
                                    width={120}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="mt-5 grid md:grid-cols-3 gap-8">
                                <div className="mt-3 flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <b>Name : </b> <b>{accountDetail?.fullname}</b>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <b>Mobile : </b> <b>{accountDetail?.mobile}</b>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <b>Balance :</b>
                                        <b>
                                            {accountDetail?.currency === "inr" ? "₹ " : "$ "}
                                            {accountDetail?.finalBalance ?? 0}
                                        </b>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <b>DOB : </b> <b>{accountDetail?.dob}</b>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <b>Currency : </b> <b>{accountDetail?.currency}</b>
                                    </div>
                                </div>
                                <div></div>
                                <Form
                                    form={transactionForm}
                                    onFinish={onFinish}
                                    layout="vertical">
                                    <div className="grid md:grid-cols-2 gap-x-3">
                                        <Form.Item
                                            label="Transaction Type"
                                            rules={[{ required: true }]}
                                            name="transactionType"
                                        >
                                            <Select
                                                placeholder="Transaction Type"
                                                className="w-full"
                                                options={[
                                                    { value: "cr", label: "CR" },
                                                    { value: "dr", label: "DR" }
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Transaction Amount"
                                            rules={[{ required: true }]}
                                            name="transactionAmount"
                                        >
                                            <Input placeholder="500.00"
                                                type="number"
                                            />
                                        </Form.Item>
                                    </div>
                                    <Form.Item
                                        label="Refrence"
                                        name="refrence"
                                    >
                                        <Input.TextArea />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            htmlType="submit"
                                            type="text"
                                            className="!bg-blue-500 !text-white !font-semibold !w-full"
                                        >
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                         : 
                        <Empty/> 
                } 
            </Card>
        </div>
    )
}
export default NewTransaction;