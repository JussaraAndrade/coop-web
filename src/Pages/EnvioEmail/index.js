import React, { useState, useRef } from "react";
import { useHistory, NavLink } from "react-router-dom";

import { useToast } from "../../hooks/toast";
import { Container, Field, FieldGroup, Form } from "./styles";
import Button from "../../Components/Button";

import logo from "../../assets/coop-logo.png";
import api from "../../services/api";

import Input from "../../Components/Input";

// import { useAuth } from "../../hooks/auth";

import * as Yup from "yup";

const EnvioEmail = () => {
  // const { email } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef(null);
  const [enviando, setEnviando] = useState(false);
  const [userEmail, setUserEmail] = useState(''); 

  const handleSubmit = async (data, { reset }) => {
    try {
      data.email = email;
      data.email = userEmail;

      setEnviando(true);
      formRef.current.setErrors({});
      
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Insira um e-mail válido.")
          .required("Informe o e-mail"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

     
      
      await api
        .post(`http://localhost:8080/api/usuarios/forgot-password`, data)
        .then((response) => {
          if (response.status === 200) {
            setEnviando(false);

            addToast({
              type: "success",
              title: "Sucesso",
              description:
                "E-mail enviado com sucesso!",
            });

            reset();
            history.push("/login");
          }
        })
        .catch(() => {
          setEnviando(false);

          addToast({
            type: "error",
            title: "Erro",
            description: "Não foi possível confirmar a doação.",
          });
        });
    } catch (err) {
      setEnviando(false);

      const validationErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;

          addToast({
            type: "error",
            title: "Erro",
            description: error.message,
          });
        });

        formRef.current.setErrors(validationErrors);
      }
    }
  };

  return (
    <Container>
      <aside></aside>

      <section>
        <NavLink to="/">
          <img src={logo} alt="Coop" />
        </NavLink>

        <Form onSubmit={handleSubmit} ref={formRef}>
          <FieldGroup>
            <Field>
              <label htmlFor="email">E-mail</label>
              <Input type="email" name="email" onChange={e => setUserEmail(e.target.value)} />
            </Field>
          </FieldGroup>
          <Button
            background="var(--verde)"
            backgroundHover="var(--roxo)"
            type="submit"
          >
            {enviando ? "Enviado..." : "Enviar"}
          </Button>
        </Form>

        <p>
          Deseja voltar para tela anterior?
          <span onClick={() => history.push("/login")}>Clique aqui</span>  
        </p>
      </section>
    </Container>
  );
};

export default EnvioEmail;
