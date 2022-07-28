import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { GlobalContext } from '../context';
import { useRouter } from 'next/router';
// Components
import { Head } from '../components'
import { Button, Card, Container, Form, Spinner } from 'react-bootstrap'
// Const
import { APIURL } from '../const/const';
// Types
import { AuthResponse } from '../types';
import { validateEmail, validatePassword } from '../utils';

export default function Login() {
    const router = useRouter();

    const { user, setUser } = useContext(GlobalContext);
    if (user) router.push('/');

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const validateFields = (): boolean => {
        const emailValidation = validateEmail(email);
        if (emailValidation.code === 0) {
            setError(emailValidation.message);
            setLoading(false);
            return false;
        }
        const passwordValidation = validatePassword(password);
        if (passwordValidation.code === 0) {
            setError(passwordValidation.message);
            setLoading(false);
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        setLoading(true);
        const fieldsAreValid = validateFields();
        if (!fieldsAreValid) return;

        try {
            const response: AuthResponse = await (await axios.post(`${APIURL}/user/login`, { email, password })).data;
            setLoading(false);

            if (response.code === 0) {
                setError(response.message);
            };

            if (response.code === 1) {
                setError(null);
                setUser({ _id: response._id, token: response.token, email, cities: [] });
                localStorage.setItem('token',response.token);
                router.push('/');
            }
        }
        catch {
            setError("There's been an unexpected error")
        }
    };

    useEffect(() => {
        if (submitted) validateFields();
    }, [submitted, email, password, validateFields]);

    return (
        <>
            <Head title="Login" />
            <main className='p-5'>
                <Container>
                    <Card>
                        <Card.Header>
                            <Card.Title>Login</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {loading ?
                                <Spinner animation="border" /> :
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className='mb-2'>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" disabled={loading} type="submit" className="mb-2">Login</Button>
                                </Form>
                            }
                            {error && !loading && <Card.Text className="text-danger">{error}</Card.Text>}
                        </Card.Body>
                        <Card.Footer>
                            <Card.Text>Don't have an account?</Card.Text>
                            <Card.Link href="/register">Register</Card.Link>
                        </Card.Footer>
                    </Card>
                </Container>
            </main>
        </>
    )
};