import {Card,Button,Form,Input,message} from "antd";
import Adminlayout from "../../Layout/Adminlayout"
import { EditFilled } from "@ant-design/icons";
import { trimData,http } from "../../../modules/modules";
import {useState,useEffect} from "react";

const {Item} = Form;
const Branding = () =>{

    const [bankForm] = Form.useForm()
    const [messageApi,context] = message.useMessage();
    const [loading,setLoading]= useState(false);
    const [photo,setPhoto]= useState(null);
    const [brandings,setBrandings]= useState(null);
    const [no,setNo]= useState(0);
    const [edit,setEdit]= useState(false);
    
    //get all branding data
        useEffect(()=>{
            const fetcher = async () =>{
                try{
                    const httpReq = http()
                    const {data} = await httpReq.get("/api/branding");
                    bankForm.setFieldsValue(data ?.data[0])
                    setBrandings(data?.data[0]);
                    setEdit(true)
                }catch(err) {
                    messageApi.error("Unable to fetch data !")
                }
            }
            fetcher();
        },[no])

        
    //store bank details in database
    const onFinish = async (values) =>{
        try{
            setLoading(true )
            const finalObj = trimData(values) ;
            finalObj.bankLogo = photo ? photo : "bankImages/dummy.jpeg"
            let userInfo = {
                email : finalObj.email,
                fullname: finalObj.fullname,
                password: finalObj.password,
                userType: "admin",
                isActive: true,
                profile: "bankImages/dummy.jpeg"
            }

            const httpReq = http()
            await httpReq.post("/api/branding",finalObj)
            await httpReq.post("/api/users",userInfo)
            messageApi.success("Branding created successfully !")
            bankForm.resetFields()
            setPhoto(null)
            setNo(no+1 )
        }catch(err) {
            messageApi.error("Unable to store branding !")
        }finally{
            setLoading(false)
        }
    }
    //update bank details in database
    const onUpdate = async (values) =>{
        try{
            setLoading(true )
            const finalObj = trimData(values) ;
            if(photo) {
                finalObj.bankLogo = photo
            }
            const httpReq = http()
            await httpReq.put(`/api/branding/${brandings._id}`,finalObj)
            messageApi.success("Branding Updated successfully !")
            bankForm.resetFields()
            setPhoto(null)
            setNo(no+1)
        }catch(err) {
            messageApi.error("Unable to update branding !")
        }finally{
            setLoading(false)
        }
    }

    //handle upload
        const handleUpload = async (e) =>{
            try{
                let file = e.target.files[0];
                const formData = new FormData();
                formData.append("photo",file);
                const httpReq = http();
                const {data} = await httpReq.post("/api/upload",formData);
                setPhoto(data.filePath);
            }catch(err) {
                messageApi.error("Failed unable to upload !")
            }
        }

    return (
        <Adminlayout>
            {context}
            <Card
            title="Bank Details"
            extra={
                <Button onClick={() => setEdit(!edit)} icon={<EditFilled/>}/>
            }
            >
                <Form
                form={bankForm}
                layout="vertical"
                onFinish={brandings ? onUpdate : onFinish}
                disabled={edit}
                >
                    <div className="grid md:grid-cols-3 gap-x-3">
                        <Item
                    label="Bank Name"
                    name="bankName"
                    rules={[{required:true}]}
                    >
                        <Input/>
                    </Item>
                    <Item
                    label="Bank Tagline"
                    rules={[{required:true}]}
                    name="bankTagline"
                    >
                        <Input/>
                    </Item>
                    <Item
                    label="Bank Logo"
                    name="xyz"
                    >
                        <Input type="file" onChange={handleUpload}/>
                    </Item>
                    <Item
                    label="Bank Account No"
                    rules={[{required:true}]}
                    name="bankAccountNo"
                    >
                        <Input/>
                    </Item>
                    <Item
                    label="Bank Account Transaction Id"
                    rules={[{required:true}]}
                    name="bankTransactionId"
                    >
                        <Input/>
                    </Item>
                    <Item
                    label="Bank Address"
                    rules={[{required:true}]}
                    name="bankAddress"
                    >
                        <Input/>
                    </Item>
                    <div className={`${brandings ? "hidden" : "md:col-span-3 grid md:grid-cols-3 gap-x-3"}`}>
                    <Item
                    label="Admin Fullname"
                    rules={[{required: brandings ?  false : true}]}
                    name="fullname"
                    >
                        <Input/>
                    </Item>
                    <Item
                    label="Admin Email"
                    rules={[{required: brandings ?  false : true}]}
                    name="email"
                    >
                        <Input/>
                    </Item>
                    <Item
                    label="Admin Password"
                    rules={[{required: brandings ?  false : true}]}
                    name="password"
                    >
                        <Input.Password/>
                    </Item>
                    </div>
                    <Item
                    label="Bank LinkedIn"
                    name="bankLinkedIn"
                    >
                        <Input type="url"/>
                    </Item>
                    <Item
                    label="Bank Twitter"
                    name="bankTwitter"
                    >
                        <Input type="url"/>
                    </Item>
                    <Item
                    label="Bank Facebook"
                    name="bankFacebook"
                    >
                        <Input type="url"/>
                    </Item>
                    </div>
                    <Item
                    label="Bank description"
                    name="bankDesc"
                    >
                        <Input.TextArea/>
                    </Item>
                    {
                        brandings ?
                        <Item className="flex justify-end items-center">
                        <Button
                        loading={loading}
                        type="text"
                        htmlType="submit"
                        className="!bg-rose-500 !text-white !font-bold"
                        >
                            Update
                        </Button>
                    </Item>
                    :
                    <Item className="flex justify-end items-center">
                        <Button
                        loading={loading}
                        type="text"
                        htmlType="submit"
                        className="!bg-blue-500 !text-white !font-bold"
                        >
                            Submit
                        </Button>
                    </Item>
                    }
                </Form>
            </Card>
        </Adminlayout>
    )
}
export default Branding