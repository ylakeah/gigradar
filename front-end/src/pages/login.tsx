import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Row, Col, Card } from 'antd';
import axios from 'axios';
import { Link, history } from 'umi';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/dev/login', values);
      localStorage.setItem('jwtToken', response.data.token);
      message.success('Login successful');
      history.push('/');
    } catch (error) {
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Login
              </Button>
            </Form.Item>
          </Form>
          <Text type="secondary">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </Text>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
