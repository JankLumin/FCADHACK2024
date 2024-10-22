// src/components/LoginForm.js

import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../services/login.js";
import { useNavigate } from "react-router-dom";
import "../styles/loginForm.css";

const schema = yup.object().shape({
  email: yup.string().email("Неверный формат email").required("Email обязателен"),
  password: yup.string().min(8, "Минимум 8 символов").required("Пароль обязателен"),
});

function LoginForm({ onSwitch, onClose, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await loginUser(data);
      reset();
      onClose();
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="auth-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="email" placeholder="Email" {...register("email")} />
          {errors.email && <p className="errors-container">{errors.email.message}</p>}

          <input type="password" placeholder="Пароль" {...register("password")} />
          {errors.password && <p className="errors-container">{errors.password.message}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Загрузка..." : "Войти"}
          </button>
          {serverError && <p className="errors-container">{serverError}</p>}
        </form>
      </div>
      <div className="toggle-form">
        <p>
          Нет аккаунта?{" "}
          <button onClick={onSwitch} className="toggle-button">
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
