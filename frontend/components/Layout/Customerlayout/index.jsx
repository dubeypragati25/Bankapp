import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  GiftOutlined,
  BranchesOutlined,
  LogoutOutlined,
  AccountBookOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import {Link,useLocation,useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies()
const { Header, Sider, Content } = Layout;

const Customerlayout = ({children}) => {

  const navigate = useNavigate(); 
  const {pathname} = useLocation();

  //logout coding
  const logoutFunc = () =>{   
    sessionStorage.removeItem("userInfo")
    cookies.remove("authToken")
    navigate("/")
  }
  
    const items=[
            {
              key: '/customer',
              icon: <DashboardOutlined />,
              label: <Link to="/customer">Dashboard</Link>,
            },
            {
              key: '/customer/transaction',
              icon: <BranchesOutlined />,
              label: <Link to="/customer/transaction">Transactions</Link>,
            },
            {
              key: '/customer/logout',
              icon: <LogoutOutlined />,
              label: <Button
              type='text'
              className='!text-gray-300 !font-semibold'
              onClick={logoutFunc}
              >Logout</Button>,
            }
            
            
          ]
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className='!min-h-screen'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Customerlayout;