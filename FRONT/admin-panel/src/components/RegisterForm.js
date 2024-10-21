// src/components/RegisterForm.js

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../services/register.js";
import "../styles/registerForm.css";

const schema = yup.object().shape({
  email: yup.string().email("Неверный формат email").required("Email обязателен"),
  password: yup.string().min(8, "Минимум 8 символов").required("Пароль обязателен"),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Пароли должны совпадать")
    .required("Подтверждение пароля обязательно"),
});

function RegisterForm({ onSwitch, onClose }) {
  const [serverError, setServerError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

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
      await registerUser(data);
      reset();
      setIsRegistered(true);
      onSwitch();
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="reg-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="email" placeholder="Email" {...register("email")} />
          {errors.email && <p className="errors-container">{errors.email.message}</p>}

          <input type="password" placeholder="Пароль" {...register("password")} />
          {errors.password && <p className="errors-container">{errors.password.message}</p>}

          <input type="password" placeholder="Повтор пароля" {...register("password_confirm")} />
          {errors.password_confirm && <p className="errors-container">{errors.password_confirm.message}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Загрузка..." : "Регистрация"}
          </button>
          {serverError && <p className="errors-container">{serverError}</p>}
        </form>
      </div>
      <div className="toggle-form">
        <p>
          Уже есть аккаунт?{" "}
          <button onClick={onSwitch} className="toggle-button">
            Войти
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
