import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col, Card, Typography } from 'antd';
import axios from 'axios';
import { history } from 'umi';

const { Title } = Typography;

const ChangePasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        'http://localhost:3000/dev/change-password',
        values,
        {
          headers: { Authorization: token },
        }
      );

      message.success('Password changed successfully');
      history.push('/');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>
            Change Password
          </Title>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your current password!',
                },
              ]}
            >
              <Input.Password placeholder="Current Password" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please input your new password!' },
              ]}
            >
              <Input.Password placeholder="New Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ChangePasswordPage;
