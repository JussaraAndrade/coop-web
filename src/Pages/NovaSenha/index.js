import React, { useState, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";

import { useToast } from "../../hooks/toast";
import { useAuth } from "../../hooks/auth";
import { Container, Field, FieldGroup, Form } from "./styles";


import Button from "../../Components/Button";

import logo from "../../assets/coop-logo.png";
import api from "../../services/api";

import Input from "../../Components/Input";

import * as Yup from "yup";


const NovaSenha = () => {
    const formRef = useRef(null);
    const { addToast } = useToast();
    const { email } = useAuth();
    
    const history = useHistory();
  
    const [atualizando, setAtualizando] = useState(false);
  
    const [alteraSenha, setAlteraSenha] = useState('');

    const handleSubmit = async (data, { reset }) => {
        try {
          data.senha = alteraSenha;
          data.email = email;
          console.log(email)
          setAtualizando(true);
          formRef.current.setErrors({});
    
          const schema = Yup.object().shape({
            senha: Yup.string().required('Informe a senha').min(6, 'Senha deve conter pelo menos 6 caracteres.'),
            novaSenha: Yup.string()
              .when('senha', {
                is: (val) => !!val.length,
                then: Yup.string().required('Campo obrigatório'),
                otherwise: Yup.string(),
              }),
            confirmSenhaOng: Yup.string()
              .when('novaSenha', {
                is: (val) => !!val.length,
                then: Yup.string().required('Campo obrigatório'),
                otherwise: Yup.string(),
              })
              .oneOf([Yup.ref('novaSenha'), null], 'Senhas não são inguais.'),
          });
    
          await schema.validate(data, {
            abortEarly: false,
          });

          data.email = email;
    
          await api.post(`http://localhost:8080/api/usuarios/savePassword`, data).then(
           (response) =>{
                setAtualizando(false);
    
                addToast({
                  type: 'success',
                  title: 'Sucesso',
                  description: 'Senha alterada com sucesso!',
                });
                reset();
                history.push('/login');
              }
          ).catch(() => {
            setAtualizando(false);
            
            addToast({
              type: 'error',
              title: 'Erro',
              description: 'Não foi possível altarar a senha.',
            });
          });
        } catch (err) {
          setAtualizando(false);
          const validationErrors = {};
    
          if (err instanceof Yup.ValidationError) {
            err.inner.forEach(error => {
              validationErrors[error.path] = error.message;
    
              setAtualizando(false);
    
              addToast({
                type: 'error',
                title: 'Erro',
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
                <label htmlFor="senhaOng">
                  Senha atual<span>*</span>
                </label>
                <Input
                  type="password"
                  name="senha"
                  onChange={e => setAlteraSenha(e.target.value)} 
                />
              </Field>

              <Field>
                <label htmlFor="confirmSenhaOng">
                  Nova senha<span>*</span>
                </label>
                <Input
                  type="password"
                  name="novaSenha"
                />
              </Field>

              <Field>
                <label htmlFor="confirmSenhaOng">
                  Confirmação da nova senha<span>*</span>
                </label>
                <Input
                  type="password"
                  name="confirmSenhaOng"
                />
              </Field>
            </FieldGroup>
            <Button
            background="var(--verde)"
            backgroundHover="var(--roxo)"
            type="submit"
          >
            {atualizando ? 'Atualizando...' : 'Atualizar'}
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
  
  export default NovaSenha;
  