import React from 'react';
import { Link, Outlet, useLocation, history } from 'umi';
import { Layout, Menu, Button } from 'antd';
import styles from './index.less';

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/register'];

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    history.push('/login');
  };

  return (
    <Layout className={styles.layout}>
      {!hideHeaderPaths.includes(location.pathname) && (
        <Header className={styles.header}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[location.pathname]}>
            <Menu.Item key="/">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/changePassword">
              <Link to="/changePassword">Change Password</Link>
            </Menu.Item>
          </Menu>
              <Button type="primary" danger onClick={handleLogout}>
                Log Out
              </Button>
        </Header>
      )}
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
