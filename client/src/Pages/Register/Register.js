import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../../context/auth'
import { useForm } from '../../util/hooks'
import Form from '../../util/Form'

import './Register.css'



function Register(props) {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})


  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(
      _,
      {
        data: { register: userData }
      }
    ) {
      context.login(userData)
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function registerUser() {
    addUser()
  }

  return (
    <section className='register-main'>
      <div className='register__title'>         
        <h2>Greetings!</h2>
      </div>      
      <div className='registration__statement'>
      <p>
        I wanted to let you know that Aunt Jane fell and broke her hip last Tuesday.
      </p>

      <p> Luckily, she is doing alright and is out of the hospital. However, she will need to 
        do in-patient therapy for the next 8 weeks.
      </p>

      <p>
        During this time, she will be staying at Symphony Care Network's South Shore location. 
        If you would like to send her a card, please address it to "Symphony Care Network c/o Jane Doe, 2425 E. 71st Street, Chicago, IL 60649".
      </p>

      <p>
        Also, the facility has set up this private, members-only network for us to use so we can communicate
        with Aunt Jane and with each other. I will try to post a weekly status update on the Login page so you'll 
        know how she is doing. 
      </p>

      <p>
        Please take a moment to register for our family group so we can keep you updated. This will also let you 
        reach out to Aunt Jane directly... I know she would love to hear from you!
      </p>

      <p>
        This is a private group that is only available to those who are invited. Your information will not be shared with 
        anyone outside of the group. Once you join, please feel free to invite anyone I may have overlooked.
      </p>

      <p>
        Best wishes,
      <br></br>
        Susie
      </p>
      </div>


      <div className='register__flex-container'>
        <div className='register__img-container'>
          <img 
            src={require(`../../Images/Patient_Photo.jpg`)} 
            alt='patient headshot'
          >
          </img>    
        </div>

        <div className='register__info-container'>

          <div className='register__form-group'>
            {Object.keys(errors).length > 0 && (
              <div className="Error Message">
                <ul className="Error__list">
                  {Object.values(errors).map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </div>
            )}

            <Form onSubmit={onSubmit} noValidate className={loading ? 'Loading register--loading' : ''}>
              <h3 className='register__form-title'>Register</h3>
              <label htmlFor="Name">
                <input
                  className='register__form-group'
                  placeholder="Name.."
                  name="name"
                  type="text"
                  value={values.name}
                  error={errors.name ? true : false}
                  onChange={onChange}
                />
              </label>
              <label htmlFor="Username">
                <input
                  className='register__form-group'
                  placeholder="Username.."
                  name="username"
                  type="text"
                  value={values.username}
                  error={errors.username ? true : false}
                  onChange={onChange}
                />
              </label>
              <label htmlFor="Email">
                <input
                  className='register__form-group'
                  placeholder="Email.."
                  name="email"
                  type="email"
                  value={values.email}
                  error={errors.email ? true : false}
                  onChange={onChange}
                />
              </label>
              <label htmlFor="Password">
                <input
                  className='register__form-group'
                  placeholder="Password.."
                  name="password"
                  type="password"
                  value={values.password}
                  error={errors.password ? true : false}
                  onChange={onChange}
                />
              </label>
              <label htmlFor="Confirm Password">
                <input
                  label="Confirm Password"
                  className='register__form-group'
                  placeholder="Confirm Password.."
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  error={errors.confirmPassword ? true : false}
                  onChange={onChange}
                />
              </label>
              <div className='Button--submit register__button'>
                <button type='submit'>
                  Register
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        name: $name
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      name
      createdAt
      token
    }
  }
`;

export default Register;