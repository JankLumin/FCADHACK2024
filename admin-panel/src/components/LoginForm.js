import './AuthForm.css';
import React, { useState } from 'react';
import { loginUser } from '../services/login.js';
import '../styles/loginForm.css'

function AuthForm(){
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await loginUser(formData);
            console.log('Пользователь вошел:', data);
            setSuccess(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleChange(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div className="form-container">
            <div className='auth-form'>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            minLength="8"
                            required
                        />

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Загрузка...' : 'Войти'}
                        </button>
                        <text className="errors-container">
                            {error && <p className = "errors">{error}</p>}
                        </text>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthForm;